import {
  NetworkId,
  PortfolioElementType,
  PortfolioLiquidity,
} from '@avingoyal01/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import {
  clmmPoolsPrefix,
  clmmNftType,
  packageIdOriginal,
  platformId,
} from './constants';
import { getClientSui } from '../../utils/clients';
import { NFTFields, Pool, PositionFields } from './types';
import { getTokenAmountsFromLiquidity } from '../../utils/clmm/tokenAmountFromLiquidity';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { formatForNative } from './helper';
import { getOwnedObjects } from '../../utils/sui/getOwnedObjects';
import { multiGetObjects } from '../../utils/sui/multiGetObjects';
import { bitsToNumber } from '../../utils/sui/bitsToNumber';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();
  const nftsPositionsRes = await getOwnedObjects(client, owner, {
    options: {
      showType: true,
      showContent: true,
      showDisplay: true,
      showOwner: true,
    },
    filter: { Package: packageIdOriginal },
  });
  if (nftsPositionsRes.length === 0) return [];

  const clmmPoolsIds: string[] = [];
  const clmmPositionsIds: string[] = [];
  const nftPositionByPositionId: Map<string, NFTFields> = new Map();
  for (let i = 0; i < nftsPositionsRes.length; i++) {
    const nftData = nftsPositionsRes[i].data;
    if (!nftData) continue;

    if (nftData.type !== clmmNftType) continue;
    if (!nftData.content) continue;

    const nftPositionFields = nftData.content.fields as NFTFields;
    clmmPoolsIds.push(nftPositionFields.pool_id);
    clmmPositionsIds.push(nftPositionFields.position_id);
    nftPositionByPositionId.set(
      nftPositionFields.position_id,
      nftPositionFields
    );
  }
  if (clmmPositionsIds.length === 0) return [];

  const pools = await cache.getItems<Pool>(clmmPoolsIds, {
    prefix: clmmPoolsPrefix,
    networkId: NetworkId.sui,
  });
  const poolsById: Map<string, Pool> = new Map();
  pools.forEach((pool) => {
    if (pool) {
      poolsById.set(pool.objectId, pool);
    }
  });

  const clmmPositionsRes = await multiGetObjects<PositionFields>(
    client,
    clmmPositionsIds,
    {
      showType: true,
      showContent: true,
      showDisplay: true,
      showOwner: true,
    }
  );

  const assets: PortfolioLiquidity[] = [];
  let totalLiquidityValue = 0;
  for (let i = 0; i < clmmPositionsRes.length; i++) {
    const clmmPosition = clmmPositionsRes[i].data?.content?.fields;
    if (!clmmPosition) continue;
    const nftPosition = nftPositionByPositionId.get(clmmPosition.id.id);
    if (!nftPosition) continue;

    const pool = poolsById.get(nftPosition.pool_id);
    if (!pool) continue;

    const { tokenAmountA, tokenAmountB } = getTokenAmountsFromLiquidity(
      new BigNumber(clmmPosition.liquidity),
      bitsToNumber(pool.tick_current_index.fields.bits),
      bitsToNumber(clmmPosition.tick_lower_index.fields.bits),
      bitsToNumber(clmmPosition.tick_upper_index.fields.bits),
      false
    );

    // TODO : améliorer le problème du 0x000002::sui::SUI + manque de 0x
    const coinA = formatForNative(`0x${nftPosition.coin_type_a.fields.name}`);
    const coinB = formatForNative(`0x${nftPosition.coin_type_b.fields.name}`);

    const tokenPriceA = await cache.getTokenPrice(coinA, NetworkId.sui);
    if (!tokenPriceA) continue;

    const assetTokenA = tokenPriceToAssetToken(
      coinA,
      tokenAmountA.dividedBy(10 ** tokenPriceA.decimals).toNumber(),
      NetworkId.sui,
      tokenPriceA
    );

    const tokenPriceB = await cache.getTokenPrice(coinB, NetworkId.sui);
    if (!tokenPriceB) continue;
    const assetTokenB = tokenPriceToAssetToken(
      coinB,
      tokenAmountB.dividedBy(10 ** tokenPriceB.decimals).toNumber(),
      NetworkId.sui,
      tokenPriceB
    );
    if (
      !assetTokenA ||
      !assetTokenB ||
      assetTokenA.value === null ||
      assetTokenB.value === null
    )
      continue;
    const value = assetTokenA.value + assetTokenB.value;
    assets.push({
      assets: [assetTokenA, assetTokenB],
      assetsValue: value,
      rewardAssets: [],
      rewardAssetsValue: 0,
      value,
      yields: [],
    });
    totalLiquidityValue += value;
  }
  if (assets.length === 0) return [];

  return [
    {
      type: PortfolioElementType.liquidity,
      networkId: NetworkId.sui,
      platformId,
      label: 'LiquidityPool',
      tags: ['Concentrated'],
      value: totalLiquidityValue,
      data: {
        liquidities: assets,
      },
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-clmms-positions`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;

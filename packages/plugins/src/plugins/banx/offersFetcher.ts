import {
  getElementLendingValues,
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  PortfolioElementType,
  solanaNativeAddress,
} from '@avingoyal01/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import {
  getAutoParsedProgramAccounts,
  usdcSolanaMint,
} from '../../utils/solana';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import {
  banxIdlItem,
  bondOfferDataSize,
  cachePrefix,
  collectionsCacheKey,
  platformId,
} from './constants';
import { BondOfferV2, Collection } from './types';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';
import { arrayToMap } from '../../utils/misc/arrayToMap';

const collectionsMemo = new MemoizedCache<
  Collection[],
  Map<string, Collection>
>(
  collectionsCacheKey,
  {
    prefix: cachePrefix,
    networkId: NetworkId.solana,
  },
  (arr) => arrayToMap(arr || [], 'marketPubkey')
);

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();

  const accounts = (
    await getAutoParsedProgramAccounts<BondOfferV2>(connection, banxIdlItem, [
      {
        dataSize: bondOfferDataSize,
      },
      {
        memcmp: {
          bytes: owner,
          offset: 130,
        },
      },
    ])
  ).filter((acc) => acc.buyOrdersQuantity !== '0');

  if (accounts.length === 0) return [];

  const [tokenPrices, collections] = await Promise.all([
    cache.getTokenPricesAsMap(
      [usdcSolanaMint, solanaNativeAddress],
      NetworkId.solana
    ),
    collectionsMemo.getItem(cache),
  ]);

  const elements: PortfolioElement[] = [];
  accounts.forEach((acc) => {
    const collection = collections.get(acc.hadoMarket);
    if (!collection) return;

    const borrowedAssets: PortfolioAsset[] = [];
    const suppliedAssets: PortfolioAsset[] = [];
    const tokenPrice = acc.bondingCurve.bondingType.linearUsdc
      ? tokenPrices.get(usdcSolanaMint)
      : tokenPrices.get(solanaNativeAddress);

    if (!tokenPrice) return;

    suppliedAssets.push(
      tokenPriceToAssetToken(
        tokenPrice.address,
        new BigNumber(acc.fundsSolOrTokenBalance)
          .dividedBy(10 ** tokenPrice.decimals)
          .toNumber(),
        NetworkId.solana,
        tokenPrice
      )
    );

    const name = `${
      Number(acc.buyOrdersQuantity) > 1 ? `${acc.buyOrdersQuantity} ` : ''
    }Lend Offer${Number(acc.buyOrdersQuantity) > 1 ? 's' : ''} on ${
      collection.collectionName
    }`;

    const { borrowedValue, suppliedValue, healthRatio, rewardValue } =
      getElementLendingValues({
        suppliedAssets,
        borrowedAssets,
        rewardAssets: [],
      });

    if (suppliedValue && suppliedValue > 0)
      elements.push({
        networkId: NetworkId.solana,
        label: 'Lending',
        platformId,
        type: PortfolioElementType.borrowlend,
        value: suppliedValue,
        name,
        data: {
          borrowedAssets,
          borrowedValue,
          borrowedYields: [],
          suppliedAssets,
          suppliedValue,
          suppliedYields: [],
          rewardAssets: [],
          rewardValue,
          healthRatio,
          value: suppliedValue,
        },
      });
  });

  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-offers`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;

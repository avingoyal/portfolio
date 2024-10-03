import {
  formatMoveTokenAddress,
  getUsdValueSum,
  NetworkId,
  PortfolioAsset,
  PortfolioElementType,
} from '@avingoyal01/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId, poolKey } from './constants';
import { Vault, VaultAccount } from './types';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { getDynamicFieldObject } from '../../utils/sui/getDynamicFieldObject';
import { getClientSui } from '../../utils/clients';
import { usdcSuiType } from '../../utils/sui/constants';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();

  const [vault, tokenPrice] = await Promise.all([
    cache.getItem<Vault>(poolKey, {
      prefix: platformId,
      networkId: NetworkId.sui,
    }),
    cache.getTokenPrice(formatMoveTokenAddress(usdcSuiType), NetworkId.sui),
  ]);

  if (!vault || !tokenPrice) return [];

  const vaultAccount = await getDynamicFieldObject<VaultAccount>(client, {
    parentId: vault.users.fields.id.id,
    name: {
      type: 'address',
      value: owner,
    },
  });

  if (!vaultAccount.data?.content?.fields) return [];

  const assets: PortfolioAsset[] = [];

  if (vaultAccount.data?.content?.fields.value.fields.amount_locked !== '0')
    assets.push(
      tokenPriceToAssetToken(
        usdcSuiType,
        new BigNumber(
          vaultAccount.data?.content?.fields.value.fields.amount_locked
        )
          .dividedBy(10 ** tokenPrice.decimals)
          .toNumber(),
        NetworkId.sui,
        tokenPrice
      )
    );

  if (
    vaultAccount.data?.content?.fields.value.fields.pending_withdrawal !== '0'
  )
    assets.push({
      ...tokenPriceToAssetToken(
        usdcSuiType,
        new BigNumber(
          vaultAccount.data?.content?.fields.value.fields.pending_withdrawal
        )
          .dividedBy(10 ** tokenPrice.decimals)
          .toNumber(),
        NetworkId.sui,
        tokenPrice
      ),
    });

  if (assets.length === 0) return [];

  return [
    {
      type: PortfolioElementType.multiple,
      label: 'LiquidityPool',
      networkId: NetworkId.sui,
      platformId,
      data: { assets },
      value: getUsdValueSum(assets.map((asset) => asset.value)),
      name: vault.name,
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-pool`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;

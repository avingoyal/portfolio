import {
  NetworkId,
  PortfolioAsset,
  PortfolioElementType,
  getUsdValueSum,
} from '@avingoyal01/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId, tulipV2ProgramId, vaultsKey } from './constants';
import { getClientSolana } from '../../utils/clients';
import { ParsedAccount, getParsedProgramAccounts } from '../../utils/solana';
import { MultiDepositOptimizerV1, depositTrackingV1Struct } from './structs';
import { userStrategyVaultsFilters } from './filters';
import tokenPriceToAssetTokens from '../../utils/misc/tokenPriceToAssetTokens';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const userVaultsAccounts = await getParsedProgramAccounts(
    client,
    depositTrackingV1Struct,
    tulipV2ProgramId,
    userStrategyVaultsFilters(owner)
  );
  if (!userVaultsAccounts) return [];

  const vaults = await cache.getItem<ParsedAccount<MultiDepositOptimizerV1>[]>(
    vaultsKey,
    {
      prefix: platformId,
      networkId: NetworkId.solana,
    }
  );
  if (!vaults) return [];

  const tokenPriceById = await cache.getTokenPricesAsMap(
    vaults.map((vault) => vault.base.sharesMint.toString()),
    NetworkId.solana
  );

  const vaultById: Map<string, MultiDepositOptimizerV1> = new Map();
  vaults.forEach((vault) => vaultById.set(vault.pubkey.toString(), vault));

  const assets: PortfolioAsset[] = [];
  for (let i = 0; i < userVaultsAccounts.length; i += 1) {
    const userVaultsAccount = userVaultsAccounts[i];
    if (userVaultsAccount.depositedBalance.isZero()) continue;

    const vault = vaultById.get(userVaultsAccount.vault.toString());
    if (!vault) continue;

    const lpTokenPrice = tokenPriceById.get(vault.base.sharesMint.toString());
    if (!lpTokenPrice) continue;

    const amount = userVaultsAccount.depositedBalance
      .div(10 ** lpTokenPrice.decimals)
      .toNumber();

    assets.push(
      ...tokenPriceToAssetTokens(
        lpTokenPrice.address,
        amount,
        NetworkId.solana,
        lpTokenPrice
      )
    );
  }
  if (assets.length === 0) return [];
  return [
    {
      platformId,
      networkId: NetworkId.solana,
      type: PortfolioElementType.multiple,
      value: getUsdValueSum(assets.map((asset) => asset.value)),
      label: 'Deposit',
      data: {
        assets,
      },
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-deposits`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;

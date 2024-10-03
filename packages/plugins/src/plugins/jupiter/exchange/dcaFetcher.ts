import {
  NetworkId,
  PortfolioAsset,
  getUsdValueSum,
} from '@avingoyal01/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../../Cache';
import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import { getClientSolana } from '../../../utils/clients';
import { getParsedProgramAccounts } from '../../../utils/solana';
import tokenPriceToAssetToken from '../../../utils/misc/tokenPriceToAssetToken';
import { platform, platformId, dcaProgramId } from './constants';
import { dcaStruct } from './structs';
import { DCAFilters } from './filters';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const accounts = await getParsedProgramAccounts(
    client,
    dcaStruct,
    dcaProgramId,
    DCAFilters(owner)
  );

  if (accounts.length === 0) return [];

  const amountByToken: Map<string, BigNumber> = new Map();

  for (const account of accounts) {
    const inputMint = account.inputMint.toString();
    const lastAmount = amountByToken.get(inputMint);
    const amountToAdd = account.inDeposited.minus(account.inUsed);
    if (!amountToAdd.isZero()) {
      if (!lastAmount) {
        amountByToken.set(inputMint, amountToAdd);
      } else {
        const newAmount = lastAmount.plus(amountToAdd);
        amountByToken.set(inputMint, newAmount);
      }
    }
  }

  if (amountByToken.size === 0) return [];

  const tokenPriceById = await cache.getTokenPricesAsMap(
    Array.from(amountByToken.keys()),
    NetworkId.solana
  );

  const assets: PortfolioAsset[] = [];
  for (const token of amountByToken.keys()) {
    const tokenPrice = tokenPriceById.get(token);
    if (!tokenPrice) continue;
    const amount = amountByToken.get(token);
    if (!amount || amount.isZero()) continue;
    const asset = tokenPriceToAssetToken(
      tokenPrice.address,
      amount.dividedBy(10 ** tokenPrice.decimals).toNumber(),
      NetworkId.solana,
      tokenPrice
    );
    assets.push(asset);
  }

  if (assets.length === 0) return [];

  return [
    {
      type: 'multiple',
      networkId: NetworkId.solana,
      platformId: platform.id,
      value: getUsdValueSum(assets.map((asset) => asset.value)),
      label: 'Deposit',
      name: `DCA Orders (${accounts.length})`,
      data: { assets },
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-dca`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;

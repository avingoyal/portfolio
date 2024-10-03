import BigNumber from 'bignumber.js';
import { NetworkId, TokenPriceSource } from '@avingoyal01/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSolana } from '../../utils/clients';
import {
  MintAccount,
  getParsedMultipleAccountsInfo,
  getParsedProgramAccounts,
  mintAccountStruct,
} from '../../utils/solana';
import { marketsInfoKey, platformId, programId } from './constants';
import { marketStruct } from './structs';
import { marketAccountFilters } from './filters';
import { MarketInfo } from './types';
import { walletTokensPlatform } from '../tokens/constants';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();
  const markets = await getParsedProgramAccounts(
    client,
    marketStruct,
    programId,
    marketAccountFilters
  );

  const mints = markets
    .map((market) => [
      market.tokenLpMintAddress,
      market.tokenPtMintAddress,
      market.tokenYtMintAddress,
      market.tokenLpMintAddress,
    ])
    .flat();

  const baseMints = markets.map((market) =>
    market.tokenSyMintAddress.toString()
  );
  const baseTokenPriceById = await cache.getTokenPricesAsMap(
    baseMints,
    NetworkId.solana
  );

  const mintsAccounts = await getParsedMultipleAccountsInfo(
    client,
    mintAccountStruct,
    mints
  );
  const mintsInfoById: Map<string, MintAccount> = new Map();
  mintsAccounts.forEach((mintAccount) => {
    if (mintAccount)
      mintsInfoById.set(mintAccount?.pubkey.toString(), mintAccount);
  });

  const sources: TokenPriceSource[] = [];
  const marketsInfos: MarketInfo[] = [];
  for (const market of markets) {
    const baseTokenPrice = baseTokenPriceById.get(
      market.tokenSyMintAddress.toString()
    );
    if (!baseTokenPrice) continue;

    const ptPrice = market.marketConfig.startPrice.dividedBy(
      market.marketConfig.marketEndPrice
    );
    const ytPrice = new BigNumber(1).minus(ptPrice);

    const ptMint = market.tokenPtMintAddress;
    const ytMint = market.tokenYtMintAddress;

    const ptDecimals = mintsInfoById.get(ptMint.toString())?.decimals;
    const ytDecimals = mintsInfoById.get(ytMint.toString())?.decimals;

    if (ptDecimals)
      sources.push({
        address: ptMint.toString(),
        decimals: ptDecimals,
        id: market.pubkey.toString(),
        networkId: NetworkId.solana,
        platformId: walletTokensPlatform.id,
        price: ptPrice.times(baseTokenPrice.price).toNumber(),
        timestamp: Date.now(),
        weight: 1,
      });

    if (ytDecimals)
      sources.push({
        address: ytMint.toString(),
        decimals: ytDecimals,
        id: market.pubkey.toString(),
        networkId: NetworkId.solana,
        platformId: walletTokensPlatform.id,
        price: ytPrice.times(baseTokenPrice.price).toNumber(),
        timestamp: Date.now(),
        weight: 1,
      });

    marketsInfos.push({
      pubkey: market.pubkey.toString(),
      ytMint: market.tokenYtMintAddress.toString(),
      lpMint: market.tokenLpMintAddress.toString(),
      ptMint: market.tokenPtMintAddress.toString(),
      syMint: market.tokenSyMintAddress.toString(),
    });
  }

  await cache.setItem(marketsInfoKey, marketsInfos, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });

  await cache.setTokenPriceSources(sources);
};

const job: Job = {
  id: `${platformId}-markets`,
  executor,
  label: 'normal',
};
export default job;

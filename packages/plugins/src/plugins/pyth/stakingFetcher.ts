import { NetworkId, PortfolioElementType } from '@avingoyal01/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId, pythMint, stakingProgramId } from './constants';
import { getClientSolana } from '../../utils/clients';
import {
  getParsedProgramAccounts,
  tokenAccountStruct,
} from '../../utils/solana';
import { positionDataStruct } from './structs';
import { positionsDataFilter } from './filters';
import { getParsedAccountInfo } from '../../utils/solana/getParsedAccountInfo';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const [stakingAccounts, tokenPrice] = await Promise.all([
    getParsedProgramAccounts(
      client,
      positionDataStruct,
      stakingProgramId,
      positionsDataFilter(owner)
    ),
    cache.getTokenPrice(pythMint, NetworkId.solana),
  ]);

  if (stakingAccounts.length !== 1) return [];

  const tokenAccount = PublicKey.findProgramAddressSync(
    [Buffer.from('custody'), stakingAccounts[0].pubkey.toBuffer()],
    stakingProgramId
  )[0];

  const tokenAccountInfo = await getParsedAccountInfo(
    client,
    tokenAccountStruct,
    tokenAccount
  );

  const amount = tokenAccountInfo?.amount;
  if (!amount || amount.isZero()) return [];

  const asset = tokenPriceToAssetToken(
    pythMint,
    amount.dividedBy(10 ** 6).toNumber(),
    NetworkId.solana,
    tokenPrice
  );

  return [
    {
      type: PortfolioElementType.multiple,
      label: 'Staked',
      networkId: NetworkId.solana,
      platformId,
      data: { assets: [asset] },
      value: asset.value,
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-staking`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;

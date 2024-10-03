import { NetworkId } from '@avingoyal01/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getAutoParsedMultipleAccountsInfo } from '../../utils/solana';
import {
  lendingPoolKey,
  lendingPools,
  nxfinanceLendIdlItem,
  platformId,
} from './constants';
import { getClientSolana } from '../../utils/clients';
import { LendingPool } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const connection = getClientSolana();

  const lendingPoolAccounts =
    await getAutoParsedMultipleAccountsInfo<LendingPool>(
      connection,
      nxfinanceLendIdlItem,
      lendingPools
    );

  await cache.setItem(lendingPoolKey, lendingPoolAccounts, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
};

const job: Job = {
  id: `${platformId}-lending-pools`,
  executor,
  label: 'normal',
};
export default job;

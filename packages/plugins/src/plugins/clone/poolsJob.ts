import { NetworkId } from '@avingoyal01/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSolana } from '../../utils/clients';
import { getParsedAccountInfo } from '../../utils/solana/getParsedAccountInfo';
import { platformId, poolsKey, poolsPubkey } from './constants';
import { PoolsStruct } from './structs';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();

  const pools = await getParsedAccountInfo(client, PoolsStruct, poolsPubkey);
  if (!pools) throw new Error('Clone Pools not found');

  await cache.setItem(poolsKey, pools.pools, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
};

const job: Job = {
  id: `${platformId}-pools`,
  executor,
  label: 'normal',
};
export default job;

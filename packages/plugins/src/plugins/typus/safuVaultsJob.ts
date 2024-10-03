import { platformId, safuVaultsKey } from './constants';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSui } from '../../utils/clients';
import { getVaultData } from './safu_helpers';
import { NetworkId } from '@avingoyal01/portfolio-core';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSui();

  const vaultsData = await getVaultData(client);

  await cache.setItem(safuVaultsKey, vaultsData, {
    prefix: platformId,
    networkId: NetworkId.sui,
  });
};

const job: Job = {
  id: `${platformId}-safu-vaults`,
  executor,
  label: 'normal',
};
export default job;

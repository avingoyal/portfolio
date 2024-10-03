import { NetworkId } from '@avingoyal01/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { dataSizeFilter } from '../../utils/solana/filters';
import { dlmmVaultProgramId, dlmmVaultsKey, platformId } from './constants';
import { dlmmVaultStruct } from './struct';
import { CachedDlmmVaults } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();
  const accounts = await getParsedProgramAccounts(
    client,
    dlmmVaultStruct,
    dlmmVaultProgramId,
    dataSizeFilter(dlmmVaultStruct.byteSize)
  );
  const vaults: CachedDlmmVaults = {};
  accounts.forEach((acc) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newAcc: any = {
      ...acc,
      pubkey: acc.pubkey.toString(),
    };
    delete newAcc['buffer'];
    delete newAcc['padding0'];
    delete newAcc['padding'];
    vaults[acc.pubkey.toString()] = newAcc;
  });

  await cache.setItem(dlmmVaultsKey, vaults, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
};

const job: Job = {
  id: `${platformId}-dlmm-vaults`,
  executor,
  label: 'normal',
};
export default job;

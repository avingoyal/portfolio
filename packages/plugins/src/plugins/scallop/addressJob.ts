import axios from 'axios';
import { NetworkId } from '@avingoyal01/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import {
  addressEndpoint,
  addressPrefix as prefix,
  addressKey,
} from './constants';

const executor: JobExecutor = async (cache: Cache) => {
  const resp = await axios.get(addressEndpoint);

  if (!resp.data) return;

  await cache.setItem(
    addressKey,
    {
      ...resp.data,
    },
    {
      prefix,
      networkId: NetworkId.sui,
    }
  );
};

const job: Job = {
  id: prefix,
  executor,
  label: 'normal',
};
export default job;

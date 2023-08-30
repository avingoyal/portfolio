import { NetworkId, Platform } from '@sonarwatch/portfolio-core';
import { Job } from '../../Job';
import { Fetcher } from '../../Fetcher';
import lendingPoolsJob from './lendingPoolsJob';
import getLendingFetcherExecutor from './getLendingFetcherExecutor';
import { aavePlatform, platformId } from './constants';

export const platforms: Platform[] = [aavePlatform];
export const jobs: Job[] = [lendingPoolsJob];
export const fetchers: Fetcher[] = [
  {
    id: `${platformId}-${NetworkId.ethereum}-lending`,
    networkId: NetworkId.ethereum,
    executor: getLendingFetcherExecutor(NetworkId.ethereum),
  },
  {
    id: `${platformId}-${NetworkId.polygon}-lending`,
    networkId: NetworkId.polygon,
    executor: getLendingFetcherExecutor(NetworkId.polygon),
  },
  {
    id: `${platformId}-${NetworkId.avalanche}-lending`,
    networkId: NetworkId.avalanche,
    executor: getLendingFetcherExecutor(NetworkId.avalanche),
  },
];

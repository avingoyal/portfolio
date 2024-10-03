import { Platform } from '@avingoyal01/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import depositsFetcher from './depositsFetcher';
import marginFetcher from './marginFetcher';
import stakingFetcher from './stakingFetcher';
// import airdropFetcher from './airdropFetcher';

export { airdropFetcher } from './helpersAirdrop';
export const platforms: Platform[] = [platform];
export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [
  depositsFetcher,
  marginFetcher,
  stakingFetcher,
  // airdropFetcher,
];

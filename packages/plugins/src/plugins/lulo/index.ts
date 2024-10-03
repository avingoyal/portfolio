import { Platform } from '@avingoyal01/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import depositsFetcher from './depositsFetcher';
import liftFetcher from './liftFetcher';
import { platform } from './constants';
import rewardsFetcher from './rewardsFetcher';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [
  depositsFetcher,
  liftFetcher,
  rewardsFetcher,
];

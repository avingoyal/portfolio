import { Platform } from '@avingoyal01/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import {
  flowmaticPlatform,
  kishuPlatform,
  madbearsPlatform,
  yakuPlatform,
  armadaPlatform,
  garyPlatform,
  geckoPlatform,
  orePlatform,
} from './constants';
import poolsJob from './poolsJob';
import stakingFetcher from './stakingFetcher';

export const platforms: Platform[] = [
  flowmaticPlatform,
  yakuPlatform,
  madbearsPlatform,
  kishuPlatform,
  armadaPlatform,
  garyPlatform,
  geckoPlatform,
  orePlatform,
];
export const jobs: Job[] = [poolsJob];
export const fetchers: Fetcher[] = [stakingFetcher];

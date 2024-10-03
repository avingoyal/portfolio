import { Platform } from '@avingoyal01/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import poolsJob from './poolsJob';
import clmmPositionFetcher from './clmmsFetcher';
import { platform } from './constants';
import vaultsJob from './vaultsJob';
import farmsFetcher from './farmsFetcher';
import limitFetcher from './limitFetcher';
import dcaFetcher from './dcaFetcher';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [poolsJob, vaultsJob];
export const fetchers: Fetcher[] = [
  clmmPositionFetcher,
  farmsFetcher,
  limitFetcher,
  dcaFetcher,
];

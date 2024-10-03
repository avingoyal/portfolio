import { Platform } from '@avingoyal01/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import positionsFetcher from './positionsFetcher';
import rewardersJob from './rewardersJob';
import redeemersJob from './redeemersJob';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [rewardersJob, redeemersJob];
export const fetchers: Fetcher[] = [positionsFetcher];

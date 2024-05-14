import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import stakingFetcher from './stakingFetcher';
import poolJob from './poolJob';
import stakingPoolJob from './stakingPoolJob';
import stakingPoolFetcher from './stakingPoolFetcher';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [poolJob, stakingPoolJob];
export const fetchers: Fetcher[] = [stakingFetcher, stakingPoolFetcher];

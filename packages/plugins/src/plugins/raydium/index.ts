import { Platform } from '@avingoyal01/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import lpTokensJob from './lpTokensJob';
import clmmJob from './clmmJob';
import cpmmJob from './cpmmJob';
import farmsJob from './farmsJob';
import { platform } from './constants';
import farmsFetcher from './farmsFetcher';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [lpTokensJob, farmsJob, clmmJob, cpmmJob];
export const fetchers: Fetcher[] = [farmsFetcher];

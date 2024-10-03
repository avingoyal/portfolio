import { Platform } from '@avingoyal01/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import poolsJob from './poolsJob';
import delegateJob from './delegateJob';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [poolsJob, delegateJob];
export const fetchers: Fetcher[] = [];

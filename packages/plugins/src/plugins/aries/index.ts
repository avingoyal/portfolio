import { Platform } from '@avingoyal01/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import depositsFetcher from './depositsFetcher';
import reserveJob from './reservesJob';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [reserveJob];
export const fetchers: Fetcher[] = [depositsFetcher];

import { Platform } from '@avingoyal01/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import basketsJob from './basketsJob';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [basketsJob];
export const fetchers: Fetcher[] = [];

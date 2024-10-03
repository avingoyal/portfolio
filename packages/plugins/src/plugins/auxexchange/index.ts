import { Platform } from '@avingoyal01/portfolio-core';
import { Job } from '../../Job';
import { Fetcher } from '../../Fetcher';
import aptosLpJob from './aptosLpJob';
import { platform } from './constants';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [aptosLpJob];
export const fetchers: Fetcher[] = [];

import { Platform } from '@avingoyal01/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import vaultsJob from './vaultsJob';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [vaultsJob];
export const fetchers: Fetcher[] = [];

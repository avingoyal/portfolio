import { Platform } from '@avingoyal01/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import lstsJob from './lstsJob';
import {
  airdropFetcher as s1AirdropFetcher,
  fetcher as s1Fetcher,
} from './s1AirdropFetcher';
import { AirdropFetcher } from '../../AirdropFetcher';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [lstsJob];
export const fetchers: Fetcher[] = [s1Fetcher];
export const airdropFetchers: AirdropFetcher[] = [s1AirdropFetcher];

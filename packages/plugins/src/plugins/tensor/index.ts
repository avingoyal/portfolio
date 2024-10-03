import { Platform } from '@avingoyal01/portfolio-core';
// import tensorFetcher from './singleListingFetcher';

import { Fetcher } from '../../Fetcher';
import { platform } from './constants';
import bidsFetcher from './bidsFetcher';
import locksFetcher from './locksFetcher';
import powerUserAirdropFetcher from './airdropPowerUsersFetcher';
import sharedEscrowFetcher from './sharedEscrowFetcher';

export const platforms: Platform[] = [platform];
export const fetchers: Fetcher[] = [
  bidsFetcher,
  locksFetcher,
  powerUserAirdropFetcher,
  sharedEscrowFetcher,
];

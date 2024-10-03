import { Platform } from '@avingoyal01/portfolio-core';
import { AirdropStatics } from '../../../AirdropFetcher';

export const platformId = 'jupiter-governance';
const platformName = 'Jupiter Governance';
const platformImage = 'https://sonar.watch/img/platforms/jupiter.webp';
const platformWebsite = 'https://vote.jup.ag/';

export const jupDisProgram = 'Dis2TfkFnXFkrtvAktEkw37sdb7qwJgY6H7YZJwk51wK';
export const platform: Platform = {
  id: platformId,
  name: platformName,
  image: platformImage,
  website: platformWebsite,
  twitter: 'https://twitter.com/JupiterExchange',
};

export const asrApi = 'https://worker.jup.ag/jup-asr-july-2024-claim-proof';
export const asr1Statics: AirdropStatics = {
  id: 'jup-asr-1',
  claimLink: 'https://vote.jup.ag/asr',
  image: platformImage,
  emitterLink: platformWebsite,
  emitterName: 'Jupiter',
  claimStart: 1719792000000,
  claimEnd: 1722470400000,
  name: 'ASR #1',
};

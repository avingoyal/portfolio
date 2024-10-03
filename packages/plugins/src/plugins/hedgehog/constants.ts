import { PublicKey } from '@solana/web3.js';
import { Platform } from '@avingoyal01/portfolio-core';

export const platformId = 'hedgehog';
export const platform: Platform = {
  id: platformId,
  name: 'Hedgehog Markets',
  image: 'https://sonar.watch/img/platforms/hedgehog.webp',
  website: 'https://hedgehog.markets',
  twitter: 'https://twitter.com/HedgehogMarket',
  // defiLlamaId: 'foo-finance', // from https://defillama.com/docs/api
};
export const ammPid = new PublicKey(
  'Hr4whNgXr3yZsJvx3TVSwfsFgXuSEPB1xKmvgrtLhsrM'
);
export const swapPid = new PublicKey(
  '2ZznCMfx2XP43zaPw9R9wKnjXWiEeEexyhdBPv3UqDtD'
);

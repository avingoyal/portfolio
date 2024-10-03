import { PublicKey } from '@solana/web3.js';
import { Platform } from '@avingoyal01/portfolio-core';

export const platformId = 'magiceden';
export const platform: Platform = {
  id: platformId,
  name: 'MagicEden',
  image: 'https://sonar.watch/img/platforms/magiceden.webp',
  // defiLlamaId: 'foo-finance', // from https://defillama.com/docs/api
  website: 'https://magiceden.io/',
  twitter: 'https://twitter.com/MagicEden',
};

export const m2Prefix = 'm2';
export const m2Program = new PublicKey(
  'M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K'
);
export const m2AuctionHouse = new PublicKey(
  'E8cU1WiRWjanGxmn96ewBgk9vPTcL6AEZ1t6F6fkgUWe'
);

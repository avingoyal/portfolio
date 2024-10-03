import { PublicKey } from '@solana/web3.js';
import { Platform } from '@avingoyal01/portfolio-core';

export const platformId = 'port';
export const platform: Platform = {
  id: platformId,
  name: 'Port',
  image: 'https://sonar.watch/img/platforms/port.webp',
  defiLlamaId: 'port-finance', // from https://defillama.com/docs/api
  website: 'https://mainnet.port.finance/lending',
  // twitter: 'https://twitter.com/myplatform',
};

export const portApi = 'https://api-v1.port.finance';
export const programId = new PublicKey(
  'Port7uDYB3wk6GJAw4KT1WpTeMtSu9bTcChBHkX2LfR'
);

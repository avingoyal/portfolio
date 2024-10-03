import { PublicKey } from '@solana/web3.js';
import { Platform } from '@avingoyal01/portfolio-core';

export const platformId = 'flexlend';
export const platform: Platform = {
  id: platformId,
  name: 'LuLo',
  image: 'https://sonar.watch/img/platforms/lulo.webp',
  defiLlamaId: 'lulo',
  website: 'https://www.lulo.fi',
  twitter: 'https://twitter.com/uselulo',
};

export const luloProgramId = new PublicKey(
  'FL3X2pRsQ9zHENpZSKDRREtccwJuei8yg9fwDu9UN69Q'
);

export const AUTOMATION_PUBLIC_KEY = new PublicKey(
  '8PWR75ppAGonv9dXStjficjXmdsuDKmDoVNcy4oYhAMs'
);

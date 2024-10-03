import { PublicKey } from '@solana/web3.js';
import { Platform } from '@avingoyal01/portfolio-core';

export const platformId = 'clone';
export const platform: Platform = {
  id: platformId,
  name: 'Clone',
  image: 'https://sonar.watch/img/platforms/clone.webp',
  defiLlamaId: 'clone-protocol', // from https://defillama.com/docs/api
  website: 'https://clone.so/',
  twitter: 'https://twitter.com/CloneProtocol',
};

export const clonePid = new PublicKey(
  'C1onEW2kPetmHmwe74YC1ESx3LnFEpVau6g2pg4fHycr'
);
export const poolsPubkey = new PublicKey(
  '5DmaSksXDg49G8586cqKjC1wd8gNVtoPmqmJeRMsQBut'
);

export const poolsKey = 'pools';

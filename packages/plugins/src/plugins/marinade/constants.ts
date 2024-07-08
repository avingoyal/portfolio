import { PublicKey } from '@solana/web3.js';
import { Platform, solanaNetwork } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';

export const platformId = 'marinade';
export const platform: Platform = {
  id: platformId,
  name: 'Marinade',
  image: 'https://sonar.watch/img/platforms/marinade.webp',
  defiLlamaId: 'parent#marinade-finance',
  website: 'https://marinade.finance/',
};

export const cachePrefix = 'marinade';
export const season2RewardsPrefix = `${platformId}-s2Rewards`;
export const marinadeTicketProgramId = new PublicKey(
  'MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD'
);
export const claimProgram = new PublicKey(
  'indiXdKbsC4QSLQQnn6ngZvkqfywn6KgEeQbkGSpk1V'
);
export const mndeMint = 'MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey';
export const mndeDecimals = 9;
export const solFactor = new BigNumber(10 ** solanaNetwork.native.decimals);
export const baseRewardsUrl =
  'https://native-staking-referral.marinade.finance/v1/rewards/';
export const season2Route = 'all/season-2?pubkey=';
export const stakerRoute = 'staker?pubkey=';
export const referrerRoute = 'referrer?pubkey=';
export const season1Unlock = new Date(1704067200000); // January 1 2024
export const season2Unlock = new Date(1711843200000); // March 31 2024

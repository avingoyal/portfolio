import { PublicKey } from '@solana/web3.js';
import { Platform } from '@avingoyal01/portfolio-core';

export const platformId = 'armada-staking-program';
export const stakePid = new PublicKey(
  'STAKEGztX7S1MUHxcQHieZhELCntb9Ys9BgUbeEtMu1'
);
export const poolsKey = 'pools';

export const armadaPlatformId = 'armada';
export const armadaPlatform: Platform = {
  id: armadaPlatformId,
  name: 'Armada',
  defiLlamaId: 'armada-staking',
  image: 'https://sonar.watch/img/platforms/armada.webp',
  website: 'https://www.armadafi.so/',
  twitter: 'https://twitter.com/ArmadaFi',
};

export const flowmaticPlatformId = 'flowmatic';
export const flowmaticPlatform: Platform = {
  id: flowmaticPlatformId,
  name: 'Flowmatic',
  image: 'https://sonar.watch/img/platforms/flowmatic.webp',
  website: 'https://www.flowmatic.xyz/',
  twitter: 'https://twitter.com/FlowmaticXYZ',
};

export const kishuPlatformId = 'kishu';
export const kishuPlatform: Platform = {
  id: kishuPlatformId,
  name: 'Kishu',
  image: 'https://sonar.watch/img/platforms/kishu.webp',
  website: 'https://staking.kishuthedog.com/',
  twitter: 'https://twitter.com/kishuthedog',
};

export const yakuPlatformId = 'yaku';
export const yakuPlatform: Platform = {
  id: yakuPlatformId,
  name: 'Yaku',
  image: 'https://sonar.watch/img/platforms/yaku.webp',
  website: 'https://staking.yaku.gg/',
  twitter: 'https://twitter.com/YakuCorp',
};

export const madbearsPlatformId = 'madbears';
export const madbearsPlatform: Platform = {
  id: madbearsPlatformId,
  name: 'MadBears',
  image: 'https://sonar.watch/img/platforms/madbears.webp',
  website: 'https://staking.madbears.club/',
  twitter: 'https://twitter.com/madbearsclub',
};

export const orePlatformId = 'ore-refinery';
export const orePlatform: Platform = {
  id: orePlatformId,
  name: 'Ore Refinery',
  image: 'https://sonar.watch/img/platforms/ore.webp',
  website: 'https://ore-refinery.netlify.app/',
  twitter: 'https://twitter.com/OreSupply',
};

export const garyPlatformId = 'gary';
export const garyPlatform: Platform = {
  id: garyPlatformId,
  name: 'Gary',
  image: 'https://sonar.watch/img/platforms/gary.webp',
  website: 'https://gary.club/lock_gary',
  twitter: 'https://twitter.com/GaryCoinOnSol',
};

export const geckoPlatformId = 'gecko';
export const geckoPlatform: Platform = {
  id: geckoPlatformId,
  name: 'Gecko',
  image: 'https://sonar.watch/img/platforms/gecko.webp',
  website: 'https://staking.geckocoin.xyz/',
  twitter: 'https://twitter.com/GeckCoin',
};

export const platformByMint = new Map([
  ['BDssJun8XSPmWq7VkoahyozsvJwKEZBkWE6YBrFHjbii', kishuPlatformId],
  ['AqEHVh8J2nXH9saV2ciZyYwPpqWFRfD2ffcq5Z8xxqm5', yakuPlatformId],
  ['Eh1fXbAipe4k7CYR9UMb2bbWmBcpU3HcyX3LWuRVFBLz', flowmaticPlatformId],
  ['Ee1pKgTQmP5xjYQs76HmRM2c2YkqEdc9tk5mQbiGFigT', madbearsPlatformId],
  ['oreoN2tQbHXVaZsr3pf66A48miqcBXCDJozganhEJgz', orePlatformId],
  ['8c71AvjQeKKeWRe8jtTGG1bJ2WiYXQdbjqFbUfhHgSVk', garyPlatformId],
  ['6CNHDCzD5RkvBWxxyokQQNQPjFWgoHF94D7BmC73X6ZK', geckoPlatformId],
]);

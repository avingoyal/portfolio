import { PortfolioAssetCollectible } from '@avingoyal01/portfolio-core';

export function isClmmPosition(nft: PortfolioAssetCollectible): boolean {
  return nft.name?.startsWith('Cropper CLMM Position') === true;
}

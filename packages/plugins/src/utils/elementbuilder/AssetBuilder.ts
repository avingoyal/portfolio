import { NetworkIdType, PortfolioAsset } from '@avingoyal01/portfolio-core';
import BigNumber from 'bignumber.js';
import { PortfolioAssetParams } from './PortfolioAssetParams';
import tokenPriceToAssetToken from '../misc/tokenPriceToAssetToken';
import { TokenPriceMap } from '../../TokenPriceMap';

export class AssetBuilder {
  address: string;
  amount: number | BigNumber | string;
  alreadyShifted: boolean;

  constructor(params: PortfolioAssetParams) {
    this.address = params.address.toString();
    this.amount = params.amount;
    this.alreadyShifted = params.alreadyShifted || false;
  }

  dump(
    networkId: NetworkIdType,
    tokenPrices: TokenPriceMap
  ): PortfolioAsset | null {
    let amount = new BigNumber(this.amount);
    if (amount.isZero()) return null;
    const tokenPrice = tokenPrices.get(this.address);
    if (!tokenPrice) return null;

    if (!this.alreadyShifted)
      amount = amount.dividedBy(10 ** tokenPrice.decimals);

    return tokenPriceToAssetToken(
      tokenPrice.address,
      amount.toNumber(),
      networkId,
      tokenPrice
    );
  }
}

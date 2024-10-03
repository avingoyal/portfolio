import {
  NetworkIdType,
  TokenPriceSource,
  formatTokenAddress,
} from '@avingoyal01/portfolio-core';
import BigNumber from 'bignumber.js';
import Decimal from 'decimal.js';
import { Cache } from '../../Cache';
import { getDecimalsForToken } from '../misc/getDecimalsForToken';
import { walletTokensPlatform } from '../../plugins/tokens/constants';
import getSourceWeight from '../misc/getSourceWeight';
import { minimumLiquidity } from '../misc/computeAndStoreLpPrice';
import { defaultAcceptedPairs } from '../misc/getLpUnderlyingTokenSource';

export default async function storeTokenPricesFromSqrt(
  cache: Cache,
  networkId: NetworkIdType,
  source: string,
  reserveX: BigNumber,
  reserveY: BigNumber,
  sqrtPrice: BigNumber,
  mintX: string,
  mintY: string,
  tempDecimalsX?: number,
  tempDecimalsY?: number
) {
  const isAcceptedX =
    defaultAcceptedPairs
      .get(networkId)
      ?.includes(formatTokenAddress(mintX, networkId)) ?? false;
  const isAcceptedY =
    defaultAcceptedPairs
      .get(networkId)
      ?.includes(formatTokenAddress(mintY, networkId)) ?? false;
  if (!isAcceptedX && !isAcceptedY) return undefined;
  if (isAcceptedX && isAcceptedY) return undefined;

  const [tokenPriceX, tokenPriceY] = await cache.getTokenPrices(
    [mintX, mintY],
    networkId
  );
  if (!tokenPriceX && !tokenPriceY) return undefined;

  const decimalsX =
    tempDecimalsX || (await getDecimalsForToken(cache, mintX, networkId));
  const decimalsY =
    tempDecimalsY || (await getDecimalsForToken(cache, mintY, networkId));
  if (!decimalsX || !decimalsY) return undefined;
  const xToYPrice = sqrtPriceX64ToPrice(sqrtPrice, decimalsX, decimalsY);

  if (tokenPriceX && isAcceptedX) {
    const price =
      tokenPriceX.price * new Decimal(1).dividedBy(xToYPrice).toNumber();
    const tvl = reserveX
      .multipliedBy(tokenPriceX.price)
      .times(2)
      .dividedBy(10 ** decimalsX);
    const weight = getSourceWeight(tvl);
    if (tvl.isLessThan(minimumLiquidity)) return undefined;
    const tokenPriceSource: TokenPriceSource = {
      id: source,
      weight,
      address: mintY,
      networkId,
      platformId: walletTokensPlatform.id,
      decimals: decimalsY,
      price,
      timestamp: Date.now(),
    };
    await cache.setTokenPriceSource(tokenPriceSource);
    return [tokenPriceX.price, price];
  }
  if (tokenPriceY && isAcceptedY) {
    const price = tokenPriceY.price * xToYPrice.toNumber();
    const tvl = reserveY
      .multipliedBy(tokenPriceY.price)
      .times(2)
      .dividedBy(10 ** decimalsY);
    const weight = getSourceWeight(tvl);
    if (tvl.isLessThan(minimumLiquidity)) return undefined;
    const tokenPriceSource: TokenPriceSource = {
      id: source,
      weight,
      address: mintX,
      networkId,
      platformId: walletTokensPlatform.id,
      decimals: decimalsX,
      price,
      timestamp: Date.now(),
    };
    await cache.setTokenPriceSource(tokenPriceSource);
    return [price, tokenPriceY.price];
  }

  return undefined;
}

const fromX64Decimal = (num: Decimal) => num.times(Decimal.pow(2, -64));

export function sqrtPriceX64ToPrice(
  sqrtPriceX64: BigNumber,
  decimalsA: number,
  decimalsB: number
): Decimal {
  return fromX64Decimal(new Decimal(sqrtPriceX64.toString()))
    .pow(2)
    .mul(Decimal.pow(10, decimalsA - decimalsB));
}

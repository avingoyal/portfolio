import { PublicKey } from '@solana/web3.js';
import axios, { AxiosResponse } from 'axios';
import {
  PortfolioAssetToken,
  getUsdValueSum,
} from '@avingoyal01/portfolio-core';
import { PriceResponse } from './types';
import { lockerPubkey, voteProgramId } from './launchpad/constants';

export function getVotePda(owner: string): PublicKey {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from('Escrow'),
      lockerPubkey.toBytes(),
      new PublicKey(owner).toBytes(),
    ],
    voteProgramId
  )[0];
}

export async function getJupiterPrices(mints: PublicKey[], vsMint: PublicKey) {
  const res = await axios.get<unknown, AxiosResponse<PriceResponse>>(
    'https://price.jup.ag/v4/price',
    {
      params: {
        ids: mints.map((m) => m.toString()).join(','),
        vsToken: vsMint.toString(),
      },
    }
  );
  const prices: Map<string, number> = new Map();
  for (const [, value] of Object.entries(res.data.data)) {
    prices.set(value.id, value.price);
  }
  return prices;
}

export function getMergedAssets(assets: PortfolioAssetToken[]) {
  const assetByMint: Map<string, PortfolioAssetToken> = new Map();
  for (const asset of assets) {
    if (asset.type !== 'token') continue;

    const { address } = asset.data;
    const amountToAdd = asset.data.amount;
    const valueToAdd = asset.value;
    const existingAsset = assetByMint.get(address);
    if (!existingAsset) {
      assetByMint.set(address, asset);
    } else {
      existingAsset.data.amount += amountToAdd;
      existingAsset.value = getUsdValueSum([valueToAdd, existingAsset.value]);
      assetByMint.set(address, existingAsset);
    }
  }

  return Array.from(assetByMint.values());
}

import { NetworkId, ethereumNativeAddress } from '@avingoyal01/portfolio-core';
import { Cache } from '../../Cache';
import { platformId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const elementRegistry = new ElementRegistry(NetworkId.ethereum, platformId);
  const element = elementRegistry.addElementMultiple({
    label: 'Deposit',
  });
  element.addAsset({
    address: ethereumNativeAddress,
    amount: 2,
    alreadyShifted: true,
  });

  return elementRegistry.dump(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-positions-ethereum`,
  networkId: NetworkId.ethereum,
  executor,
};

export default fetcher;

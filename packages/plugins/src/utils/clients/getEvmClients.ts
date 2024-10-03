import { EvmNetworkIdType, NetworkId } from '@avingoyal01/portfolio-core';
import getEvmClient from './getEvmClient';
import { EvmClient } from './types';

export default function getEvmClients(): Record<EvmNetworkIdType, EvmClient> {
  return {
    avalanche: getEvmClient(NetworkId.avalanche),
    ethereum: getEvmClient(NetworkId.ethereum),
    polygon: getEvmClient(NetworkId.polygon),
    bnb: getEvmClient(NetworkId.bnb),
  };
}

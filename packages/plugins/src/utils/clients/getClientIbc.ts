import { ibc } from 'osmojs';
import { CosmosNetworkIdType } from '@avingoyal01/portfolio-core';
import { getUrlEndpoint } from './constants';

export default function getClientIbc(networkId: CosmosNetworkIdType) {
  const urlEndpoint = getUrlEndpoint(networkId);
  return ibc.ClientFactory.createRPCQueryClient({
    rpcEndpoint: urlEndpoint,
  });
}

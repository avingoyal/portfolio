import { seiprotocol } from '@sei-js/proto';

import { NetworkId } from '@avingoyal01/portfolio-core';
import { getUrlEndpoint } from './constants';

export default function getClientSei() {
  const urlEndpoint = getUrlEndpoint(NetworkId.sei);
  return seiprotocol.ClientFactory.createRPCQueryClient({
    rpcEndpoint: urlEndpoint,
  });
}

import { NetworkId } from '@avingoyal01/portfolio-core';
import { Connection, FetchMiddleware } from '@solana/web3.js';
import { getBasicAuthHeaders } from '../misc/getBasicAuthHeaders';
import { getRpcEndpoint } from './constants';
import { SolanaClient } from './types';

export default function getClientSolana(): SolanaClient {
  const rpcEndpoint = getRpcEndpoint(NetworkId.solana);
  const httpHeaders = rpcEndpoint.basicAuth
    ? getBasicAuthHeaders(
        rpcEndpoint.basicAuth.username,
        rpcEndpoint.basicAuth.password
      )
    : undefined;

  let fetchMiddleware: FetchMiddleware | undefined;
  if (process.env['PORTFOLIO_RPC_LOGS'] === 'true') {
    const reqs: Record<string, number> = {
      total: 0,
    };
    fetchMiddleware = (info, init, fetch) => {
      const { method } = JSON.parse(init?.body?.toString() || '{}');
      if (typeof method !== 'string') return;
      if (!reqs[method]) reqs[method] = 0;
      reqs[method] += 1;
      reqs['total'] += 1;
      if (reqs['total'] % 5 === 1) {
        // eslint-disable-next-line no-console
        console.log(`RPC Requests: ${JSON.stringify(reqs, undefined, 2)}`);
      }
      fetch(info, init);
    };
  }

  return new Connection(rpcEndpoint.url, {
    httpHeaders,
    fetchMiddleware,
  });
}

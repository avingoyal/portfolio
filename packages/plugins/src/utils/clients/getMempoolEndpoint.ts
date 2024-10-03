import { RpcEndpoint } from '@avingoyal01/portfolio-core';
import urlToRpcEndpoint from './urlToRpcEndpoint';

export default function getMempoolEndpoint(): RpcEndpoint {
  const endpoint =
    process.env['PORTFOLIO_MEMPOOL_ENDPOINT'] || 'https://mempool.space/api/';
  return urlToRpcEndpoint(endpoint);
}

import {
  NetworkId,
  suiNativeAddress,
  suiNativeDecimals,
} from '@avingoyal01/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId, usersInfosOwner } from './constants';
import { getClientSui } from '../../utils/clients';
import { getDynamicFieldObjects } from '../../utils/sui/getDynamicFieldObjects';
import { UserInfo } from './types';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();

  const test = await getDynamicFieldObjects<UserInfo>(client, usersInfosOwner);
  const userInfos = test.filter(
    (object) => object.data?.content?.fields.name === owner
  );
  if (userInfos.length !== 1) return [];

  const userDeposit = userInfos[0].data?.content?.fields.value.fields;
  if (!userDeposit) return [];

  const amount = new BigNumber(userDeposit.total_amount)
    .minus(new BigNumber(userDeposit.withdrawed_amount))
    .dividedBy(10 ** suiNativeDecimals);
  if (amount.isZero()) return [];

  const tokenPrice = await cache.getTokenPrice(suiNativeAddress, NetworkId.sui);
  const asset = tokenPriceToAssetToken(
    suiNativeAddress,
    amount.toNumber(),
    NetworkId.sui,
    tokenPrice
  );

  return [
    {
      type: 'multiple',
      label: 'Deposit',
      platformId,
      networkId: NetworkId.sui,
      data: {
        assets: [asset],
      },
      value: asset.value,
      name: 'Random Vault',
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-vault`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;

import BigNumber from 'bignumber.js';
import { NetworkId, formatTokenAddress } from '@avingoyal01/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { platformId, vaultsInfo } from './constants';
import { getClientSui } from '../../utils/clients';
import { multiGetObjects } from '../../utils/sui/multiGetObjects';
import { Vault } from './types';
import getLpTokenSourceRawOld from '../../utils/misc/getLpTokenSourceRawOld';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSui();
  const objects = await multiGetObjects<Vault>(
    client,
    vaultsInfo.map((v) => v.id)
  );

  const tokenPrices = await cache.getTokenPricesAsMap(
    vaultsInfo.map((v) => v.tType),
    NetworkId.sui
  );

  for (let i = 0; i < objects.length; i++) {
    const vaultInfo = vaultsInfo[i];
    const tokenPrice = tokenPrices.get(
      formatTokenAddress(vaultInfo.tType, NetworkId.sui)
    );
    if (!tokenPrice) continue;
    const object = objects[i];
    if (!object.data?.content) continue;

    const vault = object.data.content.fields;
    let amount = new BigNumber(vault.free_balance);
    object.data?.content?.fields.strategies.fields.contents.forEach((c) => {
      amount = amount.plus(c.fields.value.fields.borrowed);
    });
    const lpSource = getLpTokenSourceRawOld(
      NetworkId.sui,
      platformId,
      platformId,
      {
        address: vaultInfo.lpType,
        decimals: vaultInfo.decimals,
        supplyRaw: new BigNumber(
          vault.lp_treasury.fields.total_supply.fields.value
        ),
      },
      [
        {
          address: vaultInfo.tType,
          decimals: vaultInfo.decimals,
          reserveAmountRaw: amount,
          price: tokenPrice.price,
        },
      ],
      'Vaults'
    );
    await cache.setTokenPriceSource(lpSource);
  }
};
const job: Job = {
  id: `${platformId}-vaults`,
  executor,
  label: 'normal',
};
export default job;

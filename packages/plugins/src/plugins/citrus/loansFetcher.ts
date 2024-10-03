import {
  NetworkId,
  PortfolioElementType,
  solanaNativeAddress,
  solanaNativeDecimals,
  PortfolioAsset,
  PortfolioElement,
  PortfolioAssetCollectible,
  collectibleFreezedTag,
  getElementNFTLendingValues,
} from '@avingoyal01/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import {
  cachePrefix,
  citrusIdlItem,
  collectionsCacheKey,
  platformId,
} from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { Collection, Loan } from './types';
import { getAutoParsedProgramAccounts } from '../../utils/solana';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { getAssetBatchDasAsMap } from '../../utils/solana/das/getAssetBatchDas';
import getSolanaDasEndpoint from '../../utils/clients/getSolanaDasEndpoint';
import { heliusAssetToAssetCollectible } from '../../utils/solana/das/heliusAssetToAssetCollectible';
import { getLoanFilters } from './filters';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';
import { arrayToMap } from '../../utils/misc/arrayToMap';

const collectionsMemo = new MemoizedCache<
  Collection[],
  Map<string, Collection>
>(
  collectionsCacheKey,
  {
    prefix: cachePrefix,
    networkId: NetworkId.solana,
  },
  (arr) => arrayToMap(arr || [], 'id')
);

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();
  const dasUrl = getSolanaDasEndpoint();

  const [filterA, filterB] = getLoanFilters(owner);
  const allAccounts = (
    await Promise.all([
      getAutoParsedProgramAccounts<Loan>(connection, citrusIdlItem, filterA),
      getAutoParsedProgramAccounts<Loan>(connection, citrusIdlItem, filterB),
    ])
  ).flat();

  const accounts = allAccounts.filter(
    (acc) => !acc.status.repaid // hide past loans
  );

  if (accounts.length === 0) return [];

  const [solTokenPrice, heliusAssets, collections] = await Promise.all([
    cache.getTokenPrice(solanaNativeAddress, NetworkId.solana),
    getAssetBatchDasAsMap(
      dasUrl,
      accounts
        .map((acc) => acc.mint)
        .filter(
          (mint) => mint && mint !== '11111111111111111111111111111111'
        ) as string[]
    ),
    collectionsMemo.getItem(cache),
  ]);
  if (!solTokenPrice || !collections) return [];

  const elements: PortfolioElement[] = [];

  accounts.forEach((acc) => {
    const collection = collections.get(acc.collectionConfig);
    if (!collection) return;

    const borrowedAssets: PortfolioAsset[] = [];
    const suppliedAssets: PortfolioAsset[] = [];

    let mintAsset: PortfolioAssetCollectible | null = null;
    if (acc.mint && acc.mint !== '11111111111111111111111111111111') {
      const heliusAsset = heliusAssets.get(acc.mint);

      if (heliusAsset) {
        const assetValue = new BigNumber(collection.floor)
          .multipliedBy(solTokenPrice.price)
          .toNumber();
        mintAsset = heliusAssetToAssetCollectible(heliusAsset, {
          tags: [collectibleFreezedTag],
          collection: {
            name: collection.name,
            floorPrice: assetValue,
          },
        });
      }
    }

    const solAsset = tokenPriceToAssetToken(
      solanaNativeAddress,
      new BigNumber(
        acc.ltvTerms ? acc.ltvTerms.maxOffer : acc.loanTerms.principal
      )
        .dividedBy(10 ** solanaNativeDecimals)
        .toNumber(),
      NetworkId.solana,
      solTokenPrice
    );

    let name;
    if (acc.lender === owner.toString()) {
      // LENDER
      suppliedAssets.push(solAsset);
      if (mintAsset) borrowedAssets.push(mintAsset);

      if (acc.status.waitingForBorrower) {
        name = `Lend Offer on ${collection.name}`;
      } else if (acc.status.active || acc.status.onSale) {
        name = `Active Loan`;
      } else if (acc.status.defaulted) {
        name = `Defaulted Loan`;
      }
    } else {
      // BORROWER
      if (mintAsset) {
        suppliedAssets.push(mintAsset);
      }

      borrowedAssets.push(solAsset);

      if (acc.status.waitingForLender) {
        name = `Borrow Offer`;
      } else if (acc.status.active || acc.status.onSale) {
        name = `Active Loan`;
      } else if (acc.status.defaulted) {
        name = `Expired Loan`;
      }
    }

    if (suppliedAssets.length > 0) {
      const { borrowedValue, suppliedValue, rewardValue, value } =
        getElementNFTLendingValues({
          suppliedAssets,
          borrowedAssets,
          rewardAssets: [],
          lender: acc.lender === owner.toString(),
        });

      elements.push({
        networkId: NetworkId.solana,
        label: 'Lending',
        platformId,
        type: PortfolioElementType.borrowlend,
        value,
        name,
        data: {
          borrowedAssets,
          borrowedValue,
          borrowedYields: [],
          suppliedAssets,
          suppliedValue,
          suppliedYields: [],
          rewardAssets: [],
          rewardValue,
          healthRatio: null,
          value,
          expireOn:
            acc.status.active || acc.status.onSale
              ? (Number(acc.startTime) + Number(acc.loanTerms.duration)) * 1000
              : undefined,
        },
      });
    }
  });

  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-loans`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;

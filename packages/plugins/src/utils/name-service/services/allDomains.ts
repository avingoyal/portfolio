import { allDomainsNameChecker } from '@sonarwatch/portfolio-core';
import { getClientSolana } from '../../clients';
import { NameService } from '../types';
import { TldParser } from '@onsol/tldparser';

async function getOwner(name: string): Promise<string | null> {
  const client = getClientSolana();
  const parser = new TldParser(client);
  const owner = await parser.getOwnerFromDomainTld(name)
  if (owner) return owner.toString();
  return null;
}

async function getNames(address: string): Promise<string[]> {
  const client = getClientSolana();

  const parser = new TldParser(client);
  const allDomainsWithNameAccounts = await parser.getParsedAllUserDomains(address).catch(() => undefined)
  if (!allDomainsWithNameAccounts) return [];
  return allDomainsWithNameAccounts.map((domainsWithNameAccounts) => domainsWithNameAccounts.domain);;
}

export const nameService: NameService = {
  id: 'allDomains',
  checker: allDomainsNameChecker,
  getNames,
  getOwner,
};

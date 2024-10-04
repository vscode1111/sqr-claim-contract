import { contractConfig } from '~seeds';
import { ContextBase } from '~types';
import { getWEB3ClaimContext, getWEB3TokenContext, getUsers } from '~utils';

export async function deployWEB3ClaimContractFixture(): Promise<ContextBase> {
  const users = await getUsers();
  const { owner2Address } = users;

  const web3TokenContext = await getWEB3TokenContext(users);
  const { web3TokenAddress } = web3TokenContext;

  const web3ClaimContext = await getWEB3ClaimContext(users, {
    newOwner: owner2Address,
    web3Token: web3TokenAddress,
    claimDelay: contractConfig.claimDelay,
  });

  return {
    ...users,
    ...web3TokenContext,
    ...web3ClaimContext,
  };
}

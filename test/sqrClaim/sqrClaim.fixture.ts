import { contractConfig } from '~seeds';
import { ContextBase } from '~types';
import { getSQRClaimContext, getSQRTokenContext, getUsers } from '~utils';

export async function deploySQRClaimContractFixture(): Promise<ContextBase> {
  const users = await getUsers();
  const { owner2Address } = users;

  const sqrTokenContext = await getSQRTokenContext(users);
  const { sqrTokenAddress } = sqrTokenContext;

  const sqrClaimContext = await getSQRClaimContext(users, {
    newOwner: owner2Address,
    sqrToken: sqrTokenAddress,
    claimDelay: contractConfig.claimDelay,
  });

  return {
    ...users,
    ...sqrTokenContext,
    ...sqrClaimContext,
  };
}

import { ContextBase } from '~types';
import { getSQRClaimContext, getSQRTokenContext, getUsers } from '~utils';

export async function deploySQRClaimContractFixture(): Promise<ContextBase> {
  const users = await getUsers();

  const sqrTokenContext = await getSQRTokenContext(users);
  const { sqrTokenAddress } = sqrTokenContext;

  const sqrClaimContext = await getSQRClaimContext(users, {
    sqrToken: sqrTokenAddress,
  });

  return {
    ...users,
    ...sqrTokenContext,
    ...sqrClaimContext,
  };
}

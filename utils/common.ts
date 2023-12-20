import { Signer } from 'ethers';
import { signMessage } from '~common';

export async function signMessageForClaim(
  signer: Signer,
  account: string,
  amount: bigint,
  transactionId: string,
  timestampLimit: number,
) {
  return signMessage(
    signer,
    //account, amount, transactionId, timestampLimit
    ['address', 'uint256', 'string', 'uint32'],
    [account, amount, transactionId, timestampLimit],
  );
}

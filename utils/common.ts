import { BigNumberish, Signer } from "ethers";
import { signMessage } from "~common";

export async function signMessageForWithdraw(
  signer: Signer,
  toAddress: string,
  amount: BigNumberish,
  transactionId: string,
) {
  return signMessage(signer, ["address", "uint256", "string"], [toAddress, amount, transactionId]);
}

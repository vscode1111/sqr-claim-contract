import { expect } from "chai";
import { Signer } from "ethers";
import { signMessage } from "~common";
import { seedData } from "~seeds";
import { ContextBase } from "~types";

export async function getSQRTokenBalance(that: ContextBase, address: string) {
  return that.ownerSQRToken.balanceOf(address);
}

export async function checkTotalSQRBalance(that: ContextBase) {
  expect(
    await getTotalSQRBalance(that, [
      that.user1Address,
      that.user2Address,
      that.user3Address,
      that.ownerAddress,
      that.owner2Address,
      that.sqrTokenAddress,
      that.sqrClaimAddress,
    ]),
  ).eq(seedData.totalAccountBalance);
}

export async function getTotalSQRBalance(that: ContextBase, accounts: string[]): Promise<bigint> {
  const result = await Promise.all(accounts.map((address) => getSQRTokenBalance(that, address)));
  return result.reduce((acc, cur) => acc + cur, seedData.zero);
}

export async function signMessageForClaim(signer: Signer, account: string, amount: bigint, transactionId: string) {
  return signMessage(
    signer,
    //account, amount, transactionId
    ["address", "uint256", "string"],
    [account, amount, transactionId],
  );
}

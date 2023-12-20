import { expect } from 'chai';
import { seedData } from '~seeds';
import { ContextBase } from '~types';

export async function getTokenBalance(that: ContextBase, address: string) {
  return that.ownerSQRToken.balanceOf(address);
}

export async function checkTotalBalance(that: ContextBase) {
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
  const result = await Promise.all(accounts.map((address) => getTokenBalance(that, address)));
  return result.reduce((acc, cur) => acc + cur, seedData.zero);
}

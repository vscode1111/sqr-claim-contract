import { expect } from 'chai';
import { seedData } from '~seeds';
import { ContextBase } from '~types';

export async function getTokenBalance(that: ContextBase, address: string) {
  return that.ownerWEB3Token.balanceOf(address);
}

export async function checkTotalBalance(that: ContextBase) {
  expect(
    await getTotalWEB3Balance(that, [
      that.user1Address,
      that.user2Address,
      that.user3Address,
      that.ownerAddress,
      that.owner2Address,
      that.web3TokenAddress,
      that.web3ClaimAddress,
    ]),
  ).eq(seedData.totalAccountBalance);
}

export async function getTotalWEB3Balance(that: ContextBase, accounts: string[]): Promise<bigint> {
  const result = await Promise.all(accounts.map((address) => getTokenBalance(that, address)));
  return result.reduce((acc, cur) => acc + cur, seedData.zero);
}

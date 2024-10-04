import { expect } from 'chai';
import { ZeroAddress } from 'ethers';
import { waitTx } from '~common';
import { contractConfig, seedData } from '~seeds';
import { findEvent, getWEB3ClaimContext, getUsers } from '~utils';
import { ChangeClaimDelayEventArgs, errorMessage } from '.';

export function shouldBehaveCorrectControl(): void {
  describe('control', () => {
    it('user1 tries to change claimDelay', async function () {
      await expect(this.user1WEB3Claim.changeClaimDelay(seedData.claimDelay)).revertedWith(
        errorMessage.onlyOwner,
      );
    });

    it('owner2 changes claimDelay', async function () {
      const receipt = await waitTx(this.owner2WEB3Claim.changeClaimDelay(seedData.claimDelay));
      const eventLog = findEvent<ChangeClaimDelayEventArgs>(receipt);
      expect(eventLog).not.undefined;
      const [account, amount] = eventLog?.args;
      expect(account).eq(this.owner2Address);
      expect(amount).eq(seedData.claimDelay);

      expect(await this.owner2WEB3Claim.claimDelay()).eq(seedData.claimDelay);
    });

    it('owner tries to deploy with zero new owner address', async function () {
      const users = await getUsers();
      await expect(
        getWEB3ClaimContext(users, {
          ...contractConfig,
          newOwner: ZeroAddress,
        }),
      ).revertedWith(errorMessage.newOwnerAddressCantBeZero);
    });

    it('owner tries to deploy with zero WEB3 token address', async function () {
      const users = await getUsers();
      await expect(
        getWEB3ClaimContext(users, {
          ...contractConfig,
          web3Token: ZeroAddress,
        }),
      ).revertedWith(errorMessage.web3TokeAddressCantBeZero);
    });
  });
}

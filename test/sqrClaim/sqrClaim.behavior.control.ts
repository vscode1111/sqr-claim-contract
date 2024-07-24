import { expect } from 'chai';
import { ZeroAddress } from 'ethers';
import { waitTx } from '~common';
import { contractConfig, seedData } from '~seeds';
import { findEvent, getSQRClaimContext, getUsers } from '~utils';
import { ChangeClaimDelayEventArgs, errorMessage } from '.';

export function shouldBehaveCorrectControl(): void {
  describe('control', () => {
    it('user1 tries to change claimDelay', async function () {
      await expect(this.user1SQRClaim.changeClaimDelay(seedData.claimDelay)).revertedWith(
        errorMessage.onlyOwner,
      );
    });

    it('owner2 changes claimDelay', async function () {
      const receipt = await waitTx(this.owner2SQRClaim.changeClaimDelay(seedData.claimDelay));
      const eventLog = findEvent<ChangeClaimDelayEventArgs>(receipt);
      expect(eventLog).not.undefined;
      const [account, amount] = eventLog?.args;
      expect(account).eq(this.owner2Address);
      expect(amount).eq(seedData.claimDelay);

      expect(await this.owner2SQRClaim.claimDelay()).eq(seedData.claimDelay);
    });

    it('owner tries to deploy with zero new owner address', async function () {
      const users = await getUsers();
      await expect(
        getSQRClaimContext(users, {
          ...contractConfig,
          newOwner: ZeroAddress,
        }),
      ).revertedWith(errorMessage.newOwnerAddressCantBeZero);
    });

    it('owner tries to deploy with zero SQR token address', async function () {
      const users = await getUsers();
      await expect(
        getSQRClaimContext(users, {
          ...contractConfig,
          sqrToken: ZeroAddress,
        }),
      ).revertedWith(errorMessage.sqrTokeAddressCantBeZero);
    });
  });
}

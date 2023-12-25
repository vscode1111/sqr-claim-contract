import { expect } from 'chai';
import { ZeroAddress } from 'ethers';
import { waitTx } from '~common';
import { contractConfig, seedData } from '~seeds';
import { findEvent, getSQRClaimContext, getSQRTokenContext, getUsers } from '~utils';
import { ChangeClaimDelayEventArgs, errorMessage } from '.';

export function shouldBehaveCorrectControl(): void {
  describe('control', () => {
    it('user1 tries to change claimDelay', async function () {
      await expect(this.user1SQRClaim.changeClaimDelay(seedData.claimDelay)).revertedWith(
        errorMessage.onlyOwner,
      );
    });

    it('owner2 changes claimDelay', async function () {
      await this.owner2SQRClaim.changeClaimDelay(seedData.claimDelay);

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
      const sqrTokenContext = await getSQRTokenContext(users);
      const { sqrTokenAddress } = sqrTokenContext;

      await expect(
        getSQRClaimContext(users, {
          newOwner: ZeroAddress,
          sqrToken: sqrTokenAddress,
          claimDelay: contractConfig.claimDelay,
        }),
      ).revertedWith(errorMessage.newOwnerAddressCantBeTheZeroAddress);
    });

    it('owner tries to deploy with zero new owner address', async function () {
      const users = await getUsers();
      const { owner2Address } = users;

      await expect(
        getSQRClaimContext(users, {
          newOwner: owner2Address,
          sqrToken: ZeroAddress,
          claimDelay: contractConfig.claimDelay,
        }),
      ).revertedWith(errorMessage.sqrTokeAddressCantBeTheZeroAddress);
    });
  });
}

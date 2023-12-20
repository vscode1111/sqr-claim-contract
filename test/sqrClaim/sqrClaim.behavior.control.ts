import { expect } from 'chai';
import { seedData } from '~seeds';
import { errorMessage } from '.';

export function shouldBehaveCorrectControl(): void {
  describe('control', () => {
    it('user1 tries to change claimDelay', async function () {
      await expect(this.user1SQRClaim.changeClaimDelay(seedData.claimDelay)).revertedWith(
        errorMessage.onlyOwner,
      );
    });

    it('owner2 changes claimDelay', async function () {
      await this.owner2SQRClaim.changeClaimDelay(seedData.claimDelay);
      expect(await this.owner2SQRClaim.claimDelay()).eq(seedData.claimDelay);
    });
  });
}

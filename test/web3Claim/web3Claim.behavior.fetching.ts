import { expect } from 'chai';
import { seedData } from '~seeds';
import { getTokenBalance } from './utils';

export function shouldBehaveCorrectFetching(): void {
  describe('fetching', () => {
    it('should be correct init values', async function () {
      expect(await this.ownerWEB3Claim.owner()).eq(this.owner2Address);
      expect(await this.ownerWEB3Claim.web3Token()).eq(this.web3TokenAddress);
    });

    it('should be correct balances', async function () {
      expect(await getTokenBalance(this, this.owner2Address)).eq(seedData.totalAccountBalance);
      expect(await this.ownerWEB3Claim.getBalance()).eq(seedData.zero);
    });
  });
}

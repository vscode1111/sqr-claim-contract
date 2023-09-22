import { expect } from "chai";
import { contractConfig, seedData } from "~seeds";

import { getSQRTokenBalance } from "./utils";

export function shouldBehaveCorrectFetching(): void {
  describe("fetching", () => {
    it("should be correct init values", async function () {
      expect(await this.ownerSQRClaim.owner()).eq(this.owner2Address);
      expect(await this.ownerSQRClaim.sqrToken()).eq(this.sqrTokenAddress);
      expect(await this.ownerSQRClaim.coldWallet()).eq(this.coldWalletAddress);
      expect(await this.ownerSQRClaim.balanceLimit()).eq(contractConfig.balanceLimit);
    });

    it("should be correct balances", async function () {
      expect(await getSQRTokenBalance(this, this.owner2Address)).eq(seedData.totalAccountBalance);
      expect(await this.ownerSQRClaim.getBalance()).eq(seedData.zero);
      expect(await this.ownerSQRClaim.totalBalance()).eq(seedData.zero);
    });
  });
}

import { expect } from "chai";
import { seedData } from "~seeds";

import { getSQRTokenBalance } from "./utils";

export function shouldBehaveCorrectFetching(): void {
  describe("fetching", () => {
    it("should be correct init values", async function () {
      expect(await this.ownerSQRClaim.owner()).eq(this.ownerAddress);
      expect(await this.ownerSQRClaim.sqrToken()).eq(this.sqrTokenAddress);
    });

    it("should be correct balances", async function () {
      expect(await getSQRTokenBalance(this, this.owner2Address)).eq(seedData.totalAccountBalance);
      expect(await this.ownerSQRClaim.getBalance()).eq(seedData.zero);
    });
  });
}

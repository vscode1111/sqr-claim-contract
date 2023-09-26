import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { SQR_CLAIM_NAME } from "~constants";
import { ContextBase } from "~types";

import { shouldBehaveCorrectFetching } from "./sqrClaim.behavior.fetching";
import { shouldBehaveCorrectControl } from "./sqrClaim.behavior.funding";
import { shouldBehaveCorrectSmokeTest } from "./sqrClaim.behavior.smoke-test";
import { deploySQRClaimContractFixture } from "./sqrClaim.fixture";

describe(SQR_CLAIM_NAME, function () {
  before(async function () {
    this.loadFixture = loadFixture;
  });

  beforeEach(async function () {
    const fixture = await this.loadFixture(deploySQRClaimContractFixture);
    for (const field in fixture) {
      this[field] = fixture[field as keyof ContextBase];
    }
  });

  shouldBehaveCorrectFetching();
  shouldBehaveCorrectControl();
  shouldBehaveCorrectSmokeTest();
});

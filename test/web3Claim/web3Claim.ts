import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { WEB3_CLAIM_NAME } from '~constants';
import { ContextBase } from '~types';
import { shouldBehaveCorrectControl } from './web3Claim.behavior.control';
import { shouldBehaveCorrectFetching } from './web3Claim.behavior.fetching';
import { shouldBehaveCorrectFunding } from './web3Claim.behavior.funding';
import { shouldBehaveCorrectSmokeTest } from './web3Claim.behavior.smokeTest';
import { deployWEB3ClaimContractFixture } from './web3Claim.fixture';

describe(WEB3_CLAIM_NAME, function () {
  before(async function () {
    this.loadFixture = loadFixture;
  });

  beforeEach(async function () {
    const fixture = await this.loadFixture(deployWEB3ClaimContractFixture);
    for (const field in fixture) {
      this[field] = fixture[field as keyof ContextBase];
    }
  });

  shouldBehaveCorrectControl();
  shouldBehaveCorrectFetching();
  shouldBehaveCorrectFunding();
  shouldBehaveCorrectSmokeTest();
});

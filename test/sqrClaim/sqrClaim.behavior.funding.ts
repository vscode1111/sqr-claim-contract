import { time } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { INITIAL_POSITIVE_CHECK_TEST_TITLE, waitTx } from "~common";
import { seedData } from "~seeds";
import { findEvent } from "~utils";

import { errorMessage } from "./testData";
import { ClaimEventArgs } from "./types";
import { checkTotalSQRBalance, getSQRTokenBalance, signMessageForClaim } from "./utils";

export function shouldBehaveCorrectControl(): void {
  describe("funding", () => {
    it("user1 tries to call claimSig without correct signature", async function () {
      const signature = await signMessageForClaim(
        this.user1,
        this.user1Address,
        seedData.amount1,
        seedData.transationId0,
      );
      await expect(
        this.user1SQRClaim.claimSig(this.user1Address, seedData.amount1, seedData.transationId0, signature),
      ).revertedWith(errorMessage.invalidSignature);
    });

    it("user1 tries to call claimSig without enough funds in contract", async function () {
      const signature = await signMessageForClaim(
        this.owner,
        this.user1Address,
        seedData.amount1,
        seedData.transationId0,
      );
      await expect(
        this.user1SQRClaim.claimSig(this.user1Address, seedData.amount1, seedData.transationId0, signature),
      ).revertedWith(errorMessage.contractMustHaveSufficientFunds);
    });

    it("user2 tries to call claimSig without enough funds in contract", async function () {
      const signature = await signMessageForClaim(
        this.owner,
        this.user2Address,
        seedData.amount2,
        seedData.transationId0,
      );
      await expect(
        this.user1SQRClaim.claimSig(this.user2Address, seedData.amount2, seedData.transationId0, signature),
      ).revertedWith(errorMessage.contractMustHaveSufficientFunds);
    });

    describe("contract has funds", () => {
      beforeEach(async function () {
        await this.owner2SQRToken.transfer(this.sqrClaimAddress, seedData.userInitBalance);
      });

      it(INITIAL_POSITIVE_CHECK_TEST_TITLE, async function () {
        expect(await getSQRTokenBalance(this, this.sqrClaimAddress)).eq(seedData.userInitBalance);
        expect(await getSQRTokenBalance(this, this.user1Address)).eq(seedData.zero);
        expect(await getSQRTokenBalance(this, this.user2Address)).eq(seedData.zero);
        expect(await getSQRTokenBalance(this, this.user3Address)).eq(seedData.zero);
        expect(await getSQRTokenBalance(this, this.ownerAddress)).eq(seedData.zero);
        expect(await getSQRTokenBalance(this, this.owner2Address)).eq(
          seedData.totalAccountBalance - seedData.userInitBalance,
        );
        await checkTotalSQRBalance(this);
      });

      it("user1 tries to call claim without permission", async function () {
        await expect(
          this.user1SQRClaim.claim(this.user2Address, seedData.amount2, seedData.transationId0, seedData.nowPlus1m),
        ).revertedWith(errorMessage.onlyOwner);
      });

      it("owner tries to call claim in timeout case 1m", async function () {
        await time.increaseTo(seedData.nowPlus1m);

        await expect(
          this.ownerSQRClaim.claim(this.user1Address, seedData.amount1, seedData.transationId0, seedData.nowPlus1m),
        ).revertedWith(errorMessage.timeoutBlocker);
      });

      it("owner calls claim correctly and check Claim event", async function () {
        const receipt = await waitTx(
          this.ownerSQRClaim.claim(this.user1Address, seedData.amount1, seedData.transationId0, seedData.nowPlus1m),
        );
        const eventLog = findEvent<ClaimEventArgs>(receipt);
        expect(eventLog).not.undefined;
        const [account, amount, transationIdHash0, timestamp] = eventLog?.args;
        expect(account).eq(this.user1Address);
        expect(amount).eq(seedData.amount1);
        expect(transationIdHash0).eq(seedData.transationIdHash0);
        expect(timestamp).closeTo(seedData.now, seedData.timeDelta);

        await checkTotalSQRBalance(this);
      });

      it("user1 calls claimSig correctly and check Claim event", async function () {
        const signature = await signMessageForClaim(
          this.owner,
          this.user1Address,
          seedData.amount1,
          seedData.transationId0,
        );

        const receipt = await waitTx(
          this.user1SQRClaim.claimSig(this.user1Address, seedData.amount1, seedData.transationId0, signature),
        );
        const eventLog = findEvent<ClaimEventArgs>(receipt);
        expect(eventLog).not.undefined;
        const [account, amount, transationIdHash0, timestamp] = eventLog?.args;
        expect(account).eq(this.user1Address);
        expect(amount).eq(seedData.amount1);
        expect(transationIdHash0).eq(seedData.transationIdHash0);
        expect(timestamp).closeTo(seedData.now, seedData.timeDelta);

        await checkTotalSQRBalance(this);
      });

      it("user2 calls claimSig correctly and check Claim event", async function () {
        const signature = await signMessageForClaim(
          this.owner,
          this.user2Address,
          seedData.amount2,
          seedData.transationId0,
        );

        this.user1SQRClaim.claimSig(this.user2Address, seedData.amount2, seedData.transationId0, signature);
        await checkTotalSQRBalance(this);
      });

      describe("user1 claimed with signature", () => {
        beforeEach(async function () {
          const signature = await signMessageForClaim(
            this.owner,
            this.user1Address,
            seedData.amount1,
            seedData.transationId0,
          );

          await this.user1SQRClaim.claimSig(this.user1Address, seedData.amount1, seedData.transationId0, signature);
        });

        it(INITIAL_POSITIVE_CHECK_TEST_TITLE, async function () {
          expect(await getSQRTokenBalance(this, this.sqrClaimAddress)).eq(seedData.userInitBalance - seedData.amount1);
          expect(await getSQRTokenBalance(this, this.user1Address)).eq(seedData.amount1);
          await checkTotalSQRBalance(this);
        });

        it("user1 tries to claim twice with signature", async function () {
          const signature = await signMessageForClaim(
            this.owner,
            this.user1Address,
            seedData.amount1,
            seedData.transationId0,
          );

          await expect(
            this.user1SQRClaim.claimSig(this.user1Address, seedData.amount1, seedData.transationId0, signature),
          ).revertedWith(errorMessage.transactionIdWasUsedBefore);
        });

        describe("user1 claimed with signature and new transactionId", () => {
          beforeEach(async function () {
            const signature = await signMessageForClaim(
              this.owner,
              this.user1Address,
              seedData.extraAmount1,
              seedData.transationId1,
            );

            await this.user1SQRClaim.claimSig(
              this.user1Address,
              seedData.extraAmount1,
              seedData.transationId1,
              signature,
            );
          });

          it(INITIAL_POSITIVE_CHECK_TEST_TITLE, async function () {
            expect(await getSQRTokenBalance(this, this.sqrClaimAddress)).eq(
              seedData.userInitBalance - seedData.amount1 - seedData.extraAmount1,
            );
            expect(await getSQRTokenBalance(this, this.user1Address)).eq(seedData.amount1 + seedData.extraAmount1);
            await checkTotalSQRBalance(this);
          });
        });
      });
    });
  });
}

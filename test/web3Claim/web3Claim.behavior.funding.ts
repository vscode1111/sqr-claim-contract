import { time } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { INITIAL_POSITIVE_CHECK_TEST_TITLE, waitTx } from '~common';
import { seedData } from '~seeds';
import { findEvent, signMessageForClaim } from '~utils';
import { errorMessage } from './testData';
import { ClaimEventArgs } from './types';
import { checkTotalBalance, getTokenBalance } from './utils';

export function shouldBehaveCorrectFunding(): void {
  describe('funding', () => {
    it('user1 tries to claimSig without correct signature', async function () {
      const signature = await signMessageForClaim(
        this.user1,
        this.user1Address,
        seedData.amount1,
        seedData.transactionId0,
        seedData.nowPlus1m,
      );
      await expect(
        this.user1WEB3Claim.claimSig(
          this.user1Address,
          seedData.amount1,
          seedData.transactionId0,
          seedData.nowPlus1m,
          signature,
        ),
      ).revertedWith(errorMessage.invalidSignature);
    });

    it('user1 tries to claimSig with zero amount', async function () {
      const signature = await signMessageForClaim(
        this.owner2,
        this.user1Address,
        seedData.zero,
        seedData.transactionId0,
        seedData.nowPlus1m,
      );
      await expect(
        this.user1WEB3Claim.claimSig(
          this.user1Address,
          seedData.zero,
          seedData.transactionId0,
          seedData.nowPlus1m,
          signature,
        ),
      ).revertedWith(errorMessage.amountMustBeGreaterThanZero);
    });

    it('user1 tries to claimSig without enough funds in contract', async function () {
      const signature = await signMessageForClaim(
        this.owner2,
        this.user1Address,
        seedData.amount1,
        seedData.transactionId0,
        seedData.nowPlus1m,
      );

      await expect(
        this.user1WEB3Claim.claimSig(
          this.user1Address,
          seedData.amount1,
          seedData.transactionId0,
          seedData.nowPlus1m,
          signature,
        ),
      ).revertedWith(errorMessage.contractMustHaveSufficientFunds);
    });

    it('user2 tries to claimSig without enough funds in contract', async function () {
      const signature = await signMessageForClaim(
        this.owner2,
        this.user2Address,
        seedData.amount2,
        seedData.transactionId0,
        seedData.nowPlus1m,
      );

      await expect(
        this.user1WEB3Claim.claimSig(
          this.user2Address,
          seedData.amount2,
          seedData.transactionId0,
          seedData.nowPlus1m,
          signature,
        ),
      ).revertedWith(errorMessage.contractMustHaveSufficientFunds);
    });

    describe('contract has funds', () => {
      beforeEach(async function () {
        await this.owner2WEB3Token.transfer(this.web3ClaimAddress, seedData.userInitBalance);
      });

      it(INITIAL_POSITIVE_CHECK_TEST_TITLE, async function () {
        expect(await getTokenBalance(this, this.web3ClaimAddress)).eq(seedData.userInitBalance);
        expect(await getTokenBalance(this, this.user1Address)).eq(seedData.zero);
        expect(await getTokenBalance(this, this.user2Address)).eq(seedData.zero);
        expect(await getTokenBalance(this, this.user3Address)).eq(seedData.zero);
        expect(await getTokenBalance(this, this.ownerAddress)).eq(seedData.zero);
        expect(await getTokenBalance(this, this.owner2Address)).eq(
          seedData.totalAccountBalance - seedData.userInitBalance,
        );

        const user1undItem = await this.user1WEB3Claim.fetchFundItem(this.user1Address);
        expect(user1undItem.amount).eq(seedData.zero);
        const user2fundItem = await this.user1WEB3Claim.fetchFundItem(this.user2Address);
        expect(user2fundItem.amount).eq(seedData.zero);
        const user3fundItem = await this.user1WEB3Claim.fetchFundItem(this.user3Address);
        expect(user3fundItem.amount).eq(seedData.zero);
        const ownerfundItem = await this.user1WEB3Claim.fetchFundItem(this.ownerAddress);
        expect(ownerfundItem.amount).eq(seedData.zero);
        const owner2fundItem = await this.user1WEB3Claim.fetchFundItem(this.owner2Address);
        expect(owner2fundItem.amount).eq(seedData.zero);

        await checkTotalBalance(this);
      });

      it('owner tries to claimSig without correct signature', async function () {
        const signature = await signMessageForClaim(
          this.owner,
          this.user1Address,
          seedData.amount1,
          seedData.transactionId0,
          seedData.nowPlus1m,
        );
        await expect(
          this.user1WEB3Claim.claimSig(
            this.user1Address,
            seedData.amount1,
            seedData.transactionId0,
            seedData.nowPlus1m,
            signature,
          ),
        ).revertedWith(errorMessage.invalidSignature);
      });

      it('user1 tries to claim without permission', async function () {
        await expect(
          this.user1WEB3Claim.claim(
            this.user2Address,
            seedData.amount2,
            seedData.transactionId0,
            seedData.nowPlus1m,
          ),
        ).revertedWith(errorMessage.onlyOwner);
      });

      it('owner2 tries to claim in timeout case 1m', async function () {
        await time.increaseTo(seedData.nowPlus1m);

        await expect(
          this.owner2WEB3Claim.claim(
            this.user1Address,
            seedData.amount1,
            seedData.transactionId0,
            seedData.nowPlus1m,
          ),
        ).revertedWith(errorMessage.timeoutBlockerForTimestampLimit);
      });

      it('owner2 tries to claim with signature in timeout case 1m', async function () {
        await time.increaseTo(seedData.nowPlus1d1m);

        const signature = await signMessageForClaim(
          this.owner2,
          this.user1Address,
          seedData.amount1,
          seedData.transactionId0,
          seedData.nowPlus1m,
        );

        await expect(
          this.owner2WEB3Claim.claimSig(
            this.user1Address,
            seedData.amount1,
            seedData.transactionId0,
            seedData.nowPlus1m,
            signature,
          ),
        ).revertedWith(errorMessage.timeoutBlockerForTimestampLimit);
      });

      it('owner2 claims correctly and check Claim event', async function () {
        const receipt = await waitTx(
          this.owner2WEB3Claim.claim(
            this.user1Address,
            seedData.amount1,
            seedData.transactionId0,
            seedData.nowPlus1m,
          ),
        );
        const eventLog = findEvent<ClaimEventArgs>(receipt);
        expect(eventLog).not.undefined;
        const [account, amount, transactionIdHash0, timestamp] = eventLog?.args;
        expect(account).eq(this.user1Address);
        expect(amount).eq(seedData.amount1);
        expect(transactionIdHash0).eq(seedData.transactionIdHash0);
        expect(timestamp).closeTo(seedData.now, seedData.timeDelta);

        expect(await this.owner2WEB3Claim.getTransactionIdHash(seedData.transactionId0)).eq(
          seedData.transactionIdHash0,
        );

        const transactionItem = await this.owner2WEB3Claim.fetchTransactionItem(
          seedData.transactionId0,
        );
        expect(transactionItem[0]).eq(seedData.transactionIdHash0);
        expect(transactionItem[1][0]).eq(this.user1Address);
        expect(transactionItem[1][1]).eq(seedData.amount1);

        await checkTotalBalance(this);
      });

      it('user1 claims correctly using signature and check Claim event', async function () {
        const signature = await signMessageForClaim(
          this.owner2,
          this.user1Address,
          seedData.amount1,
          seedData.transactionId0,
          seedData.nowPlus1m,
        );

        const receipt = await waitTx(
          this.user1WEB3Claim.claimSig(
            this.user1Address,
            seedData.amount1,
            seedData.transactionId0,
            seedData.nowPlus1m,
            signature,
          ),
        );
        const eventLog = findEvent<ClaimEventArgs>(receipt);
        expect(eventLog).not.undefined;
        const [account, amount, transactionIdHash0, timestamp] = eventLog?.args;
        expect(account).eq(this.user1Address);
        expect(amount).eq(seedData.amount1);
        expect(transactionIdHash0).eq(seedData.transactionIdHash0);
        expect(timestamp).closeTo(seedData.now, seedData.timeDelta);

        await checkTotalBalance(this);
      });

      it('user2 claimSig correctly and check Claim event', async function () {
        const signature = await signMessageForClaim(
          this.owner2,
          this.user2Address,
          seedData.amount2,
          seedData.transactionId0,
          seedData.nowPlus1m,
        );

        this.user1WEB3Claim.claimSig(
          this.user2Address,
          seedData.amount2,
          seedData.transactionId0,
          seedData.nowPlus1m,
          signature,
        );
        await checkTotalBalance(this);
      });

      describe('user1 claimed with signature', () => {
        beforeEach(async function () {
          const signature = await signMessageForClaim(
            this.owner2,
            this.user1Address,
            seedData.amount1,
            seedData.transactionId0,
            seedData.nowPlus1m,
          );

          await this.user1WEB3Claim.claimSig(
            this.user1Address,
            seedData.amount1,
            seedData.transactionId0,
            seedData.nowPlus1m,
            signature,
          );
        });

        it(INITIAL_POSITIVE_CHECK_TEST_TITLE, async function () {
          expect(await getTokenBalance(this, this.web3ClaimAddress)).eq(
            seedData.userInitBalance - seedData.amount1,
          );
          expect(await getTokenBalance(this, this.user1Address)).eq(seedData.amount1);

          const user1undItem = await this.user1WEB3Claim.fetchFundItem(this.user1Address);
          expect(user1undItem.amount).eq(seedData.amount1);
          expect(user1undItem.claimDate).closeTo(seedData.now, seedData.timeDelta);

          await checkTotalBalance(this);
        });

        it('user1 tries to claim twice with signature', async function () {
          const signature = await signMessageForClaim(
            this.owner2,
            this.user1Address,
            seedData.amount1,
            seedData.transactionId0,
            seedData.nowPlus1m,
          );

          await expect(
            this.user1WEB3Claim.claimSig(
              this.user1Address,
              seedData.amount1,
              seedData.transactionId0,
              seedData.nowPlus1m,
              signature,
            ),
          ).revertedWith(errorMessage.transactionIdWasUsedBefore);
        });

        it('user1 tries to claim twice with signature', async function () {
          const signature = await signMessageForClaim(
            this.owner2,
            this.user1Address,
            seedData.amount1,
            seedData.transactionId1,
            seedData.nowPlus1m,
          );

          await expect(
            this.user1WEB3Claim.claimSig(
              this.user1Address,
              seedData.amount1,
              seedData.transactionId1,
              seedData.nowPlus1m,
              signature,
            ),
          ).revertedWith(errorMessage.timeBlockerForAccount);
        });

        describe('user1 claimed with signature and new transactionId', () => {
          beforeEach(async function () {
            await time.increaseTo(seedData.nowPlus1d1m);

            const signature = await signMessageForClaim(
              this.owner2,
              this.user1Address,
              seedData.extraAmount1,
              seedData.transactionId1,
              seedData.nowPlus1d2m,
            );

            await this.user1WEB3Claim.claimSig(
              this.user1Address,
              seedData.extraAmount1,
              seedData.transactionId1,
              seedData.nowPlus1d2m,
              signature,
            );
          });

          it(INITIAL_POSITIVE_CHECK_TEST_TITLE, async function () {
            expect(await getTokenBalance(this, this.web3ClaimAddress)).eq(
              seedData.userInitBalance - seedData.amount1 - seedData.extraAmount1,
            );
            expect(await getTokenBalance(this, this.user1Address)).eq(
              seedData.amount1 + seedData.extraAmount1,
            );
            const user2fundItem = await this.user1WEB3Claim.fetchFundItem(this.user2Address);
            expect(user2fundItem.amount).eq(seedData.zero);
            await checkTotalBalance(this);
          });
        });
      });
    });
  });
}

import { expect } from "chai";
import { INITIAL_POSITIVE_CHECK_TEST_TITLE, waitTx } from "~common";
import { contractConfig, seedData } from "~seeds";

import { errorMessage } from "./testData";
import { DepositEventArgs, WithdrawEventArgs } from "./types";
import { checkTotalSQRBalance, findEvent, getSQRTokenBalance } from "./utils";

export function shouldBehaveCorrectControl(): void {
  describe("funding", () => {
    it("should throw error when user1 tries to deposit without allowence", async function () {
      await expect(this.user1SQRClaim.deposit(seedData.deposit1)).revertedWith(errorMessage.userMustAllowToUseOfFund);
    });

    it("should throw error when user1 tries to withdraw insufficent funds", async function () {
      await expect(this.user1SQRClaim.withdraw(seedData.deposit1)).revertedWith(errorMessage.insufficentFunds);
    });

    it("should throw error when user2 tries to deposit without allowence", async function () {
      await expect(this.user2SQRClaim.deposit(seedData.deposit2)).revertedWith(errorMessage.userMustAllowToUseOfFund);
    });

    it("should throw error when user2 tries to withdraw insufficent funds", async function () {
      await expect(this.user2SQRClaim.withdraw(seedData.deposit2)).revertedWith(errorMessage.insufficentFunds);
    });

    describe("user1 and user2 have tokens and approved contract to use these", () => {
      beforeEach(async function () {
        await this.owner2SQRToken.transfer(this.user1Address, seedData.userInitBalance);
        await this.user1SQRToken.approve(this.sqrClaimAddress, seedData.deposit1);

        await this.owner2SQRToken.transfer(this.user2Address, seedData.userInitBalance);
        await this.user2SQRToken.approve(this.sqrClaimAddress, seedData.deposit2);
      });

      it(INITIAL_POSITIVE_CHECK_TEST_TITLE, async function () {
        expect(await getSQRTokenBalance(this, this.user1Address)).eq(seedData.userInitBalance);
        expect(await getSQRTokenBalance(this, this.user2Address)).eq(seedData.userInitBalance);

        await checkTotalSQRBalance(this);
      });

      it("should throw error when user1 tries to withdraw insufficent funds", async function () {
        await expect(this.user1SQRClaim.withdraw(seedData.deposit1)).revertedWith(errorMessage.insufficentFunds);
      });

      it("user1 is allowed to deposit", async function () {
        const receipt = await waitTx(this.user1SQRClaim.deposit(seedData.deposit1));
        const eventLog = findEvent<DepositEventArgs>(receipt);

        expect(eventLog).not.undefined;
        const [account, amount, timestamp] = eventLog?.args;
        expect(account).eq(this.user1Address);
        expect(amount).eq(seedData.deposit1);
        expect(timestamp).closeTo(seedData.now, seedData.timeDelta);

        await checkTotalSQRBalance(this);
      });

      describe("user1 deposited funds", () => {
        beforeEach(async function () {
          await this.user1SQRClaim.deposit(seedData.deposit1);
        });

        it(INITIAL_POSITIVE_CHECK_TEST_TITLE, async function () {
          expect(await getSQRTokenBalance(this, this.user1Address)).eq(seedData.userInitBalance - seedData.deposit1);

          expect(await this.owner2SQRClaim.balanceOf(this.user1Address)).eq(seedData.deposit1);

          const fundItem = await this.user1SQRClaim.fetchFundItem(this.user1Address);
          expect(fundItem.balance).eq(seedData.deposit1);

          expect(await this.owner2SQRClaim.totalBalance()).eq(seedData.deposit1);

          await checkTotalSQRBalance(this);
        });

        it("user1 is allowed to withdraw", async function () {
          const receipt = await waitTx(this.user1SQRClaim.withdraw(seedData.withdraw1));
          const eventLog = findEvent<WithdrawEventArgs>(receipt);

          expect(eventLog).not.undefined;
          const [account, amount, timestamp] = eventLog?.args;
          expect(account).eq(this.user1Address);
          expect(amount).eq(seedData.withdraw1);
          expect(timestamp).closeTo(seedData.now, seedData.timeDelta);

          await checkTotalSQRBalance(this);
        });

        describe("user1 withdrew funds", () => {
          beforeEach(async function () {
            await this.user1SQRClaim.withdraw(seedData.withdraw1);
          });

          it(INITIAL_POSITIVE_CHECK_TEST_TITLE, async function () {
            const user1Address = this.user1Address;

            expect(await getSQRTokenBalance(this, user1Address)).eq(seedData.userInitBalance - seedData.remains1);
            expect(await this.owner2SQRClaim.getBalance()).eq(seedData.remains1);

            expect(await this.owner2SQRClaim.balanceOf(user1Address)).eq(seedData.remains1);

            const fundItem = await this.user1SQRClaim.fetchFundItem(user1Address);
            expect(fundItem.balance).eq(seedData.remains1);

            expect(await this.owner2SQRClaim.totalBalance()).eq(seedData.remains1);

            await checkTotalSQRBalance(this);
          });

          it("should throw error when user1 tries to withdraw insufficent funds", async function () {
            await expect(this.user1SQRClaim.withdraw(seedData.deposit1)).revertedWith(errorMessage.insufficentFunds);
          });

          it("should throw error when user2 tries to withdraw insufficent funds", async function () {
            await expect(this.user2SQRClaim.withdraw(seedData.deposit2)).revertedWith(errorMessage.insufficentFunds);
          });

          describe("user2 deposited funds", () => {
            beforeEach(async function () {
              await this.user2SQRClaim.deposit(seedData.deposit2);
            });

            it(INITIAL_POSITIVE_CHECK_TEST_TITLE, async function () {
              const user2Address = this.user2Address;

              expect(await getSQRTokenBalance(this, user2Address)).eq(seedData.userInitBalance - seedData.deposit2);
              expect(await this.owner2SQRClaim.getBalance()).eq(seedData.remains1 + seedData.deposit2);

              expect(await this.owner2SQRClaim.balanceOf(user2Address)).eq(seedData.deposit2);

              const fundItem = await this.user1SQRClaim.fetchFundItem(user2Address);
              expect(fundItem.balance).eq(seedData.deposit2);

              expect(await this.owner2SQRClaim.totalBalance()).eq(seedData.remains1 + seedData.deposit2);

              await checkTotalSQRBalance(this);
            });

            it("should throw error when user1 tries to withdraw insufficent funds", async function () {
              await expect(this.user1SQRClaim.withdraw(seedData.deposit1)).revertedWith(errorMessage.insufficentFunds);
            });

            describe("user2 withdrew funds", () => {
              beforeEach(async function () {
                await this.user2SQRClaim.withdraw(seedData.withdraw2);
              });

              it(INITIAL_POSITIVE_CHECK_TEST_TITLE, async function () {
                const user2Address = this.user2Address;

                expect(await getSQRTokenBalance(this, user2Address)).eq(seedData.userInitBalance - seedData.remains2);
                expect(await this.owner2SQRClaim.getBalance()).eq(seedData.remains1 + seedData.remains2);

                expect(await this.owner2SQRClaim.balanceOf(user2Address)).eq(seedData.remains2);

                const fundItem = await this.user1SQRClaim.fetchFundItem(user2Address);
                expect(fundItem.balance).eq(seedData.remains2);

                expect(await this.owner2SQRClaim.totalBalance()).eq(
                  seedData.remains1 + seedData.deposit2 - seedData.withdraw2,
                );

                await checkTotalSQRBalance(this);
              });

              it("should throw error when user1 tries to withdraw insufficent funds", async function () {
                await expect(this.user1SQRClaim.withdraw(seedData.deposit1)).revertedWith(
                  errorMessage.insufficentFunds,
                );
              });

              it("should throw error when user2 tries to withdraw insufficent funds", async function () {
                await expect(this.user2SQRClaim.withdraw(seedData.deposit2)).revertedWith(
                  errorMessage.insufficentFunds,
                );
              });

              describe("user1 deposited extra-funds", () => {
                beforeEach(async function () {
                  await this.user1SQRToken.approve(this.sqrClaimAddress, seedData.extraDeposit1);
                  await this.user1SQRClaim.deposit(seedData.extraDeposit1);
                });

                it(INITIAL_POSITIVE_CHECK_TEST_TITLE, async function () {
                  const amount = seedData.extraDeposit1;
                  const balanceLimit = contractConfig.balanceLimit;
                  expect(await this.owner2SQRClaim.getBalance()).eq(balanceLimit);

                  const supposedBalance = seedData.remains1 + seedData.remains2 + seedData.extraDeposit1;
                  const coldRemains = supposedBalance - balanceLimit;
                  const userRemains = amount - coldRemains;

                  expect(await getSQRTokenBalance(this, this.user1Address)).eq(
                    seedData.userInitBalance - seedData.remains1 - seedData.extraDeposit1,
                  );
                  expect(await getSQRTokenBalance(this, this.coldWalletAddress)).eq(coldRemains);

                  expect(await this.owner2SQRClaim.balanceOf(this.user1Address)).eq(seedData.remains1 + userRemains);

                  const fundItem = await this.user1SQRClaim.fetchFundItem(this.user1Address);
                  expect(fundItem.balance).eq(seedData.remains1 + userRemains);

                  expect(await this.owner2SQRClaim.totalBalance()).eq(
                    seedData.remains1 + seedData.deposit2 - seedData.withdraw2 + seedData.extraDeposit1,
                  );

                  await checkTotalSQRBalance(this);
                });

                it("should throw error when user2 tries to withdraw insufficent funds", async function () {
                  await expect(this.user2SQRClaim.withdraw(seedData.deposit2)).revertedWith(
                    errorMessage.insufficentFunds,
                  );
                });

                describe("owner2 withdrew funds", () => {
                  beforeEach(async function () {
                    await this.owner2SQRClaim.ownerWithdraw(this.coldWalletAddress, seedData.owner2Withdraw);
                  });

                  it(INITIAL_POSITIVE_CHECK_TEST_TITLE, async function () {
                    const amount = seedData.extraDeposit1;
                    const balanceLimit = contractConfig.balanceLimit;
                    expect(await this.owner2SQRClaim.getBalance()).eq(balanceLimit - seedData.owner2Withdraw);

                    const supposedBalance = seedData.remains1 + seedData.remains2 + seedData.extraDeposit1;
                    const coldRemains = supposedBalance - balanceLimit;
                    const userRemains = amount - coldRemains;

                    expect(await getSQRTokenBalance(this, this.user1Address)).eq(
                      seedData.userInitBalance - seedData.remains1 - seedData.extraDeposit1,
                    );
                    expect(await getSQRTokenBalance(this, this.coldWalletAddress)).eq(
                      coldRemains + seedData.owner2Withdraw,
                    );

                    expect(await this.owner2SQRClaim.balanceOf(this.user1Address)).eq(seedData.remains1 + userRemains);

                    const fundItem = await this.user1SQRClaim.fetchFundItem(this.user1Address);
                    expect(fundItem.balance).eq(seedData.remains1 + userRemains);

                    expect(await this.owner2SQRClaim.totalBalance()).eq(
                      seedData.remains1 + seedData.deposit2 - seedData.withdraw2 + seedData.extraDeposit1,
                    );

                    await checkTotalSQRBalance(this);
                  });

                  it("should throw error when user1 tries to call ownerWithdraw", async function () {
                    await expect(
                      this.user1SQRClaim.ownerWithdraw(this.coldWalletAddress, seedData.deposit2),
                    ).revertedWith(errorMessage.onlyOwner);
                  });

                  it("should throw error when user2 tries to call ownerWithdraw", async function () {
                    await expect(
                      this.user2SQRClaim.ownerWithdraw(this.coldWalletAddress, seedData.deposit2),
                    ).revertedWith(errorMessage.onlyOwner);
                  });

                  it("should throw error when owner tries to call ownerWithdraw without enough funds", async function () {
                    await expect(
                      this.owner2SQRClaim.ownerWithdraw(this.coldWalletAddress, seedData.extraDeposit1),
                    ).revertedWith(errorMessage.contractMustHaveSufficientFunds);
                  });
                });
              });
            });
          });
        });
      });
    });
  });
}

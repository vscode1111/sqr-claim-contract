import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { callWithTimerHre, getTxOverrides, waitTx } from '~common';
import { SQR_CLAIM_NAME } from '~constants';
import { contractConfig, seedData } from '~seeds';
import { getAddressesFromHre, getContext, signMessageForClaim } from '~utils';

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment): Promise<void> => {
  await callWithTimerHre(async () => {
    const { sqrClaimAddress } = getAddressesFromHre(hre);
    console.log(`${SQR_CLAIM_NAME} ${sqrClaimAddress} is claiming with signature...`);
    const sqrTokenAddress = contractConfig.sqrToken;
    const context = await getContext(sqrTokenAddress, sqrClaimAddress);
    const { owner2, user1Address, user1SQRClaim } = context;

    const transactionId = seedData.transactionId0;
    const timestampLimit = seedData.nowPlus1m;

    const contractBalance = await user1SQRClaim.getBalance();

    const params = {
      account: user1Address,
      amount: contractBalance,
      transactionId,
      timestampLimit,
      signature: '',
    };

    params.signature = await signMessageForClaim(
      owner2,
      params.account,
      params.amount,
      params.transactionId,
      params.timestampLimit,
    );

    console.table(params);

    await waitTx(
      user1SQRClaim.claimSig(
        params.account,
        params.amount,
        params.transactionId,
        params.timestampLimit,
        params.signature,
        await getTxOverrides(),
      ),
      'claim-sig',
    );
  }, hre);
};

func.tags = [`${SQR_CLAIM_NAME}:claim-sig-all`];

export default func;

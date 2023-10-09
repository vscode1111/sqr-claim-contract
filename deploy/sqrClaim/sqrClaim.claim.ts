import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { callWithTimerHre, waitTx } from '~common';
import { SQR_CLAIM_NAME } from '~constants';
import { contractConfig, seedData } from '~seeds';
import { getAddressesFromHre, getContext } from '~utils';

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment): Promise<void> => {
  await callWithTimerHre(async () => {
    const { sqrClaimAddress } = getAddressesFromHre(hre);
    console.log(`${SQR_CLAIM_NAME} ${sqrClaimAddress} is claiming with signature...`);
    const sqrTokenAddress = contractConfig.sqrToken;
    const context = await getContext(sqrTokenAddress, sqrClaimAddress);
    const { user1Address, ownerSQRClaim } = context;

    const params = {
      account: user1Address,
      amount: seedData.amount1,
      transationId: seedData.transationId0,
      timestampLimit: seedData.nowPlus1m,
    };

    console.table(params);

    await waitTx(
      ownerSQRClaim.claim(
        params.account,
        params.amount,
        params.transationId,
        params.timestampLimit,
      ),
      'claim',
    );
  }, hre);
};

func.tags = [`${SQR_CLAIM_NAME}:claim`];

export default func;

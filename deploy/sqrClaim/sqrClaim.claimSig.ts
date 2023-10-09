import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { callWithTimerHre, waitTx } from '~common';
import { SQR_CLAIM_NAME } from '~constants';
import { contractConfig, seedData } from '~seeds';
import { signMessageForClaim } from '~test';
import { getAddressesFromHre, getContext } from '~utils';

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment): Promise<void> => {
  await callWithTimerHre(async () => {
    const { sqrClaimAddress } = getAddressesFromHre(hre);
    console.log(`${SQR_CLAIM_NAME} ${sqrClaimAddress} is claiming with signature...`);
    const sqrTokenAddress = contractConfig.sqrToken;
    const context = await getContext(sqrTokenAddress, sqrClaimAddress);
    const { owner, user1Address, user1SQRClaim } = context;

    const transationId = seedData.transationId0;
    const timestampLimit = seedData.nowPlus1m;
    // const transationId = '62813e9b-bde7-40bf-adde-4cf3c3d76002';
    // const timestampLimit = 1696252209;

    const signature = await signMessageForClaim(
      owner,
      user1Address,
      seedData.amount1,
      transationId,
      timestampLimit,
    );

    const params = {
      account: user1Address,
      amount: seedData.amount1,
      transationId,
      timestampLimit,
      signature,
    };

    console.table(params);

    await waitTx(
      user1SQRClaim.claimSig(
        params.account,
        params.amount,
        params.transationId,
        params.timestampLimit,
        params.signature,
      ),
      'claim-sig',
    );
  }, hre);
};

func.tags = [`${SQR_CLAIM_NAME}:claim-sig`];

export default func;

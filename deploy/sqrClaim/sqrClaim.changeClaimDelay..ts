import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { callWithTimerHre, waitTx } from '~common';
import { SQR_CLAIM_NAME } from '~constants';
import { contractConfig, seedData } from '~seeds';
import { getAddressesFromHre, getContext } from '~utils';
import { deployData } from './deployData';

const IS_ZERO = true;

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment): Promise<void> => {
  await callWithTimerHre(async () => {
    const { sqrClaimAddress } = getAddressesFromHre(hre);
    console.log(`${SQR_CLAIM_NAME} ${sqrClaimAddress} is claiming with signature...`);
    const sqrTokenAddress = contractConfig.sqrToken;
    const context = await getContext(sqrTokenAddress, sqrClaimAddress);
    const { owner2SQRClaim } = context;

    const params = {
      claimDelay: IS_ZERO ? seedData.zero : deployData.claimDelay,
    };

    console.table(params);

    await waitTx(owner2SQRClaim.changeClaimDelay(params.claimDelay), 'changeClaimDelay');
  }, hre);
};

func.tags = [`${SQR_CLAIM_NAME}:change-claim-delay`];

export default func;

import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { callWithTimerHre, sleep, verifyContract } from '~common';
import { SQR_CLAIM_NAME } from '~constants';
import { contractConfig } from '~seeds';
import { getSQRClaimContext, getUsers } from '~utils';
import { verifyRequired } from './deployData';
import { getContractArgsEx } from './utils';

const pauseTime = 10;

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment): Promise<void> => {
  await callWithTimerHre(async () => {
    console.log(`${SQR_CLAIM_NAME} is deploying...`);
    console.table(contractConfig);
    console.log(`Pause ${pauseTime} sec to make sure...`);
    await sleep(pauseTime * 1000);

    console.log(`Deploying...`);
    const { sqrClaimAddress } = await getSQRClaimContext(await getUsers(), {
      sqrToken: contractConfig.sqrToken,
    });
    console.log(`${SQR_CLAIM_NAME} deployed to ${sqrClaimAddress}`);
    if (verifyRequired) {
      await verifyContract(sqrClaimAddress, hre, getContractArgsEx());
      console.log(`${SQR_CLAIM_NAME} deployed and verified to ${sqrClaimAddress}`);
    }
  }, hre);
};

func.tags = [`${SQR_CLAIM_NAME}:deploy`];

export default func;

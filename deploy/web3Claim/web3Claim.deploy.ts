import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { callWithTimerHre, sleep, verifyContract } from '~common';
import { WEB3_CLAIM_NAME } from '~constants';
import { contractConfig } from '~seeds';
import { getWEB3ClaimContext, getUsers } from '~utils';
import { verifyRequired } from './deployData';
import { getContractArgsEx } from './utils';

const pauseTime = 10;

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment): Promise<void> => {
  await callWithTimerHre(async () => {
    console.log(`${WEB3_CLAIM_NAME} is deploying...`);
    console.table(contractConfig);
    console.log(`Pause ${pauseTime} sec to make sure...`);
    await sleep(pauseTime * 1000);

    console.log(`Deploying...`);
    const { web3ClaimAddress } = await getWEB3ClaimContext(await getUsers(), {
      newOwner: contractConfig.newOwner,
      web3Token: contractConfig.web3Token,
      claimDelay: contractConfig.claimDelay,
    });
    console.log(`${WEB3_CLAIM_NAME} deployed to ${web3ClaimAddress}`);
    if (verifyRequired) {
      await verifyContract(web3ClaimAddress, hre, getContractArgsEx());
      console.log(`${WEB3_CLAIM_NAME} deployed and verified to ${web3ClaimAddress}`);
    }
  }, hre);
};

func.tags = [`${WEB3_CLAIM_NAME}:deploy`];

export default func;

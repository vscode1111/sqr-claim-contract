import { upgrades } from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { callWithTimerHre, verifyContract } from '~common';
import { WEB3_CLAIM_NAME } from '~constants';
import { getAddressesFromHre, getWEB3ClaimContext, getUsers } from '~utils';
import { verifyRequired } from './deployData';

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment): Promise<void> => {
  await callWithTimerHre(async () => {
    const { web3ClaimAddress } = getAddressesFromHre(hre);
    console.log(`${WEB3_CLAIM_NAME} ${web3ClaimAddress} is upgrading...`);
    const { owner2Web3ClaimFactory } = await getWEB3ClaimContext(await getUsers(), web3ClaimAddress);
    await upgrades.upgradeProxy(web3ClaimAddress, owner2Web3ClaimFactory);
    console.log(`${WEB3_CLAIM_NAME} upgraded to ${web3ClaimAddress}`);
    if (verifyRequired) {
      await verifyContract(web3ClaimAddress, hre);
      console.log(`${WEB3_CLAIM_NAME} upgraded and verified to ${web3ClaimAddress}`);
    }
  }, hre);
};

func.tags = [`${WEB3_CLAIM_NAME}:upgrade`];

export default func;

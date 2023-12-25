import { upgrades } from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { callWithTimerHre, verifyContract } from '~common';
import { SQR_CLAIM_NAME } from '~constants';
import { getAddressesFromHre, getSQRClaimContext, getUsers } from '~utils';
import { verifyRequired } from './deployData';

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment): Promise<void> => {
  await callWithTimerHre(async () => {
    const { sqrClaimAddress } = getAddressesFromHre(hre);
    console.log(`${SQR_CLAIM_NAME} ${sqrClaimAddress} is upgrading...`);
    const { owner2SqrClaimFactory } = await getSQRClaimContext(await getUsers(), sqrClaimAddress);
    await upgrades.upgradeProxy(sqrClaimAddress, owner2SqrClaimFactory);
    console.log(`${SQR_CLAIM_NAME} upgraded to ${sqrClaimAddress}`);
    if (verifyRequired) {
      await verifyContract(sqrClaimAddress, hre);
      console.log(`${SQR_CLAIM_NAME} upgraded and verified to ${sqrClaimAddress}`);
    }
  }, hre);
};

func.tags = [`${SQR_CLAIM_NAME}:upgrade`];

export default func;

import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { callWithTimerHre, verifyContract } from '~common';
import { SQR_CLAIM_NAME } from '~constants';
import { getAddressesFromHre } from '~utils';
import { getContractArgsEx } from './utils';

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment): Promise<void> => {
  await callWithTimerHre(async () => {
    const { sqrClaimAddress: sqrTokenAddress } = getAddressesFromHre(hre);
    console.log(`${SQR_CLAIM_NAME} ${sqrTokenAddress} is verify...`);
    await verifyContract(sqrTokenAddress, hre, getContractArgsEx());
  }, hre);
};

func.tags = [`${SQR_CLAIM_NAME}:verify`];

export default func;

import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { callWithTimerHre, verifyContract } from '~common';
import { WEB3_CLAIM_NAME } from '~constants';
import { getAddressesFromHre } from '~utils';
import { getContractArgsEx } from './utils';

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment): Promise<void> => {
  await callWithTimerHre(async () => {
    const { web3ClaimAddress: web3TokenAddress } = getAddressesFromHre(hre);
    console.log(`${WEB3_CLAIM_NAME} ${web3TokenAddress} is verify...`);
    await verifyContract(web3TokenAddress, hre, getContractArgsEx());
  }, hre);
};

func.tags = [`${WEB3_CLAIM_NAME}:verify`];

export default func;

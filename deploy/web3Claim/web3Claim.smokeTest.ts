import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { callWithTimerHre } from '~common';
import { WEB3_CLAIM_NAME } from '~constants';
import { contractConfig } from '~seeds';
import { smokeTest } from '~test';
import { getAddressesFromHre, getContext } from '~utils';

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment): Promise<void> => {
  await callWithTimerHre(async () => {
    const { web3ClaimAddress } = getAddressesFromHre(hre);
    console.log(`${WEB3_CLAIM_NAME} ${web3ClaimAddress} is fetching...`);
    const web3TokenAddress = contractConfig.web3Token;
    const context = await getContext(web3TokenAddress, web3ClaimAddress);
    await smokeTest(context);
  }, hre);
};

func.tags = [`${WEB3_CLAIM_NAME}:smoke-test`];

export default func;

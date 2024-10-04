import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { callWithTimerHre, getTxOverrides, waitTx } from '~common';
import { WEB3_CLAIM_NAME } from '~constants';
import { contractConfig, seedData } from '~seeds';
import { getAddressesFromHre, getContext } from '~utils';
import { deployData } from './deployData';

const IS_ZERO = true;

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment): Promise<void> => {
  await callWithTimerHre(async () => {
    const { web3ClaimAddress } = getAddressesFromHre(hre);
    console.log(`${WEB3_CLAIM_NAME} ${web3ClaimAddress} is changing ClaimDelay...`);
    const web3TokenAddress = contractConfig.web3Token;
    const context = await getContext(web3TokenAddress, web3ClaimAddress);
    const { owner2WEB3Claim } = context;

    const params = {
      claimDelay: IS_ZERO ? seedData.zero : deployData.claimDelay,
    };

    console.table(params);

    await waitTx(
      owner2WEB3Claim.changeClaimDelay(params.claimDelay, await getTxOverrides(1, 10 ** 5)),
      'changeClaimDelay',
    );
  }, hre);
};

func.tags = [`${WEB3_CLAIM_NAME}:change-claim-delay`];

export default func;

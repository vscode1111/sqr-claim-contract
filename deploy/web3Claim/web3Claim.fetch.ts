import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { callWithTimerHre } from '~common';
import { WEB3_CLAIM_NAME } from '~constants';
import { getAddressesFromHre, getWEB3ClaimContext, getUsers } from '~utils';

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment): Promise<void> => {
  await callWithTimerHre(async () => {
    const { web3ClaimAddress } = getAddressesFromHre(hre);
    console.log(`${WEB3_CLAIM_NAME} ${web3ClaimAddress} is fetching...`);
    const users = await getUsers();
    const { ownerWEB3Claim } = await getWEB3ClaimContext(users, web3ClaimAddress);

    const [owner, web3Token, balance, claimDelay] = await Promise.all([
      ownerWEB3Claim.owner(),
      ownerWEB3Claim.web3Token(),
      ownerWEB3Claim.getBalance(),
      ownerWEB3Claim.claimDelay(),
    ]);

    const result = {
      owner,
      web3Token,
      balance,
      claimDelay,
    };

    console.table(result);
  }, hre);
};

func.tags = [`${WEB3_CLAIM_NAME}:fetch`];

export default func;

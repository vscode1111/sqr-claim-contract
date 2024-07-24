import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { callWithTimerHre } from '~common';
import { SQR_CLAIM_NAME } from '~constants';
import { getAddressesFromHre, getSQRClaimContext, getUsers } from '~utils';

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment): Promise<void> => {
  await callWithTimerHre(async () => {
    const { sqrClaimAddress } = getAddressesFromHre(hre);
    console.log(`${SQR_CLAIM_NAME} ${sqrClaimAddress} is fetching...`);
    const users = await getUsers();
    const { ownerSQRClaim } = await getSQRClaimContext(users, sqrClaimAddress);

    const [owner, sqrToken, balance, claimDelay] = await Promise.all([
      ownerSQRClaim.owner(),
      ownerSQRClaim.sqrToken(),
      ownerSQRClaim.getBalance(),
      ownerSQRClaim.claimDelay(),
    ]);

    const result = {
      owner,
      sqrToken,
      balance,
      claimDelay,
    };

    console.table(result);
  }, hre);
};

func.tags = [`${SQR_CLAIM_NAME}:fetch`];

export default func;

import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { callWithTimerHre } from "~common";
import { SQR_CLAIM_NAME } from "~constants";
import { getAddressesFromHre, getSQRClaimContext, getUsers } from "~utils";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment): Promise<void> => {
  await callWithTimerHre(async () => {
    const { sqrClaimAddress } = await getAddressesFromHre(hre);
    console.log(`${SQR_CLAIM_NAME} ${sqrClaimAddress} is fetching...`);
    const users = await getUsers();
    const { ownerSQRClaim } = await getSQRClaimContext(users, sqrClaimAddress);

    const result = {
      owner: await ownerSQRClaim.owner(),
      sqrToken: await ownerSQRClaim.sqrToken(),
      coldWallet: await ownerSQRClaim.coldWallet(),
      balanceLimit: await ownerSQRClaim.balanceLimit(),
    };

    console.table(result);
  }, hre);
};

func.tags = [`${SQR_CLAIM_NAME}:fetch`];

export default func;

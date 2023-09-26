import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { callWithTimerHre } from "~common";
import { SQR_CLAIM_NAME } from "~constants";
import { contractConfig } from "~seeds";
import { smokeTest } from "~test";
import { getAddressesFromHre, getContext } from "~utils";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment): Promise<void> => {
  await callWithTimerHre(async () => {
    const { sqrClaimAddress } = await getAddressesFromHre(hre);
    console.log(`${SQR_CLAIM_NAME} ${sqrClaimAddress} is fetching...`);
    const sqrTokenAddress = contractConfig.sqrToken;
    const context = await getContext(sqrTokenAddress, sqrClaimAddress);
    await smokeTest(context);
  }, hre);
};

func.tags = [`${SQR_CLAIM_NAME}:smoke-test`];

export default func;

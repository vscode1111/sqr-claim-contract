import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { callWithTimerHre, getTxOverrides, waitTx } from '~common';
import { SQR_CLAIM_NAME } from '~constants';
import { contractConfig } from '~seeds';
import { getAddressesFromHre, getContext } from '~utils';

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment): Promise<void> => {
  await callWithTimerHre(async () => {
    const { sqrClaimAddress } = getAddressesFromHre(hre);
    console.log(`${SQR_CLAIM_NAME} ${sqrClaimAddress} is claiming with signature...`);
    const sqrTokenAddress = contractConfig.sqrToken;
    const context = await getContext(sqrTokenAddress, sqrClaimAddress);
    const { user1SQRClaim } = context;

    const params = {
      account: '0x955f7b8ff78b7e4d5895101be455822ccff1519b',
      amount: BigInt(100000),
      transactionId: '62813e9b-bde7-40bf-adde-4cf3c3d76001',
      timestampLimit: 1704468658,
      signature:
        '0xfa60be9fdfed58ac5d25b98e6fe59556d09d5cd10f272b3571af69dd3ecf5be4406d137158e93c3b29c0af59f77bf413aeeb1422858ce43fa15c8d4a628db79f1c',
    };

    console.table(params);

    await waitTx(
      user1SQRClaim.claimSig(
        params.account,
        params.amount,
        params.transactionId,
        params.timestampLimit,
        params.signature,
        await getTxOverrides(),
      ),
      'claim-sig',
    );
  }, hre);
};

func.tags = [`${SQR_CLAIM_NAME}:claim-sig-manual`];

export default func;

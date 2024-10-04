import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { callWithTimerHre, getTxOverrides, waitTx } from '~common';
import { WEB3_CLAIM_NAME } from '~constants';
import { contractConfig } from '~seeds';
import { getAddressesFromHre, getContext } from '~utils';

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment): Promise<void> => {
  await callWithTimerHre(async () => {
    const { web3ClaimAddress } = getAddressesFromHre(hre);
    console.log(`${WEB3_CLAIM_NAME} ${web3ClaimAddress} is claiming with signature...`);
    const web3TokenAddress = contractConfig.web3Token;
    const context = await getContext(web3TokenAddress, web3ClaimAddress);
    const { user1WEB3Claim } = context;

    const body = {
      account: '0x955f7b8ff78b7e4d5895101be455822ccff1519b',
      amount: 0.001,
      transactionId: '62813e9b-bde7-40bf-adde-4cf3c3d76001',
    };

    const response = {
      signature:
        '0x81d70709927cc726a2e209bb0ba728c7417f20097c55e297506bc17e0c4229945aaefa0ee667eac0fffff076bce117baac1806edbbdeb9ddc2fb1b6233f1200d1c',
      amountInWei: '100000',
      timestampNow: 1725444507,
      timestampLimit: 1725445107,
    };

    const params = {
      account: body.account,
      amount: BigInt(response.amountInWei),
      transactionId: body.transactionId,
      timestampLimit: response.timestampLimit,
      signature: response.signature,
    };

    console.table(params);

    await waitTx(
      user1WEB3Claim.claimSig(
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

func.tags = [`${WEB3_CLAIM_NAME}:claim-sig-manual`];

export default func;

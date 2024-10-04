import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { callWithTimerHre, getTxOverrides, waitTx } from '~common';
import { WEB3_CLAIM_NAME } from '~constants';
import { contractConfig, seedData } from '~seeds';
import { getAddressesFromHre, getContext, signMessageForClaim } from '~utils';

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment): Promise<void> => {
  await callWithTimerHre(async () => {
    const { web3ClaimAddress } = getAddressesFromHre(hre);
    console.log(`${WEB3_CLAIM_NAME} ${web3ClaimAddress} is claiming with signature...`);
    const web3TokenAddress = contractConfig.web3Token;
    const context = await getContext(web3TokenAddress, web3ClaimAddress);
    const { owner2, user1Address, user1WEB3Claim } = context;

    const transactionId = seedData.transactionId0;
    const timestampLimit = seedData.nowPlus1m;

    const contractBalance = await user1WEB3Claim.getBalance();

    const params = {
      account: user1Address,
      amount: contractBalance,
      transactionId,
      timestampLimit,
      signature: '',
    };

    params.signature = await signMessageForClaim(
      owner2,
      params.account,
      params.amount,
      params.transactionId,
      params.timestampLimit,
    );

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

func.tags = [`${WEB3_CLAIM_NAME}:claim-sig-all`];

export default func;

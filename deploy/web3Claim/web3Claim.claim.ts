import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { callWithTimerHre, waitTx } from '~common';
import { WEB3_CLAIM_NAME } from '~constants';
import { contractConfig, seedData } from '~seeds';
import { getAddressesFromHre, getContext } from '~utils';

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment): Promise<void> => {
  await callWithTimerHre(async () => {
    const { web3ClaimAddress } = getAddressesFromHre(hre);
    console.log(`${WEB3_CLAIM_NAME} ${web3ClaimAddress} is claiming with signature...`);
    const web3TokenAddress = contractConfig.web3Token;
    const context = await getContext(web3TokenAddress, web3ClaimAddress);
    const { user3Address, owner2WEB3Claim } = context;

    const params = {
      account: user3Address,
      amount: seedData.amount1,
      transactionId: seedData.transactionId0,
      timestampLimit: seedData.nowPlus1m,
    };

    console.table(params);

    await waitTx(
      owner2WEB3Claim.claim(
        params.account,
        params.amount,
        params.transactionId,
        params.timestampLimit,
      ),
      'claim',
    );
  }, hre);
};

func.tags = [`${WEB3_CLAIM_NAME}:claim`];

export default func;

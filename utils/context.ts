import { DeployProxyOptions } from '@openzeppelin/hardhat-upgrades/dist/utils';
import { ethers, upgrades } from 'hardhat';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { getNetworkName } from '~common';
import { SQR_CLAIM_NAME, SQR_TOKEN_NAME, TOKENS } from '~constants';
import { ContractConfig, getContractArgs, getTokenArgs } from '~seeds';
import { SQRClaim } from '~typechain-types/contracts/SQRClaim';
import { SQRToken } from '~typechain-types/contracts/SQRToken';
import { SQRClaim__factory } from '~typechain-types/factories/contracts/SQRClaim__factory';
import { SQRToken__factory } from '~typechain-types/factories/contracts/SQRToken__factory';
import {
  Addresses,
  ContextBase,
  DeployNetworks,
  SQRClaimContext,
  SQRTokenContext,
  Users,
} from '~types';

const OPTIONS: DeployProxyOptions = {
  initializer: 'initialize',
  kind: 'uups',
};

export function getAddresses(network: keyof DeployNetworks): Addresses {
  const sqrClaimAddress = TOKENS.SQR_CLAIM[network];
  return {
    sqrClaimAddress,
  };
}

export function getAddressesFromHre(hre: HardhatRuntimeEnvironment) {
  return getAddresses(getNetworkName(hre));
}

export async function getUsers(): Promise<Users> {
  const [owner, user1, user2, user3, owner2] = await ethers.getSigners();

  const ownerAddress = await owner.getAddress();
  const user1Address = await user1.getAddress();
  const user2Address = await user2.getAddress();
  const user3Address = await user3.getAddress();
  const owner2Address = await owner2.getAddress();

  return {
    owner,
    ownerAddress,
    user1,
    user1Address,
    user2,
    user2Address,
    user3,
    user3Address,
    owner2,
    owner2Address,
  };
}

export async function getSQRTokenContext(
  users: Users,
  deployData?: string | { newOnwer: string },
): Promise<SQRTokenContext> {
  const { owner, user1, user2, user3, owner2, owner2Address } = users;

  const testSQRTokenFactory = (await ethers.getContractFactory(
    SQR_TOKEN_NAME,
  )) as any as SQRToken__factory;

  let ownerSQRToken: SQRToken;

  if (typeof deployData === 'string') {
    ownerSQRToken = testSQRTokenFactory.connect(owner).attach(deployData) as SQRToken;
  } else {
    const newOnwer = deployData?.newOnwer ?? owner2Address;
    ownerSQRToken = await testSQRTokenFactory.connect(owner).deploy(...getTokenArgs(newOnwer));
  }

  const sqrTokenAddress = await ownerSQRToken.getAddress();

  const user1SQRToken = ownerSQRToken.connect(user1);
  const user2SQRToken = ownerSQRToken.connect(user2);
  const user3SQRToken = ownerSQRToken.connect(user3);
  const owner2SQRToken = ownerSQRToken.connect(owner2);

  return {
    sqrTokenAddress,
    ownerSQRToken,
    user1SQRToken,
    user2SQRToken,
    user3SQRToken,
    owner2SQRToken,
  };
}

export async function getSQRClaimContext(
  users: Users,
  deployData?: string | ContractConfig,
): Promise<SQRClaimContext> {
  const { owner, user1, user2, user3, owner2 } = users;

  const sqrClaimFactory = (await ethers.getContractFactory(
    SQR_CLAIM_NAME,
  )) as unknown as SQRClaim__factory;

  let ownerSQRClaim: SQRClaim;

  if (typeof deployData === 'string') {
    ownerSQRClaim = sqrClaimFactory.connect(owner).attach(deployData) as SQRClaim;
  } else {
    ownerSQRClaim = (await upgrades.deployProxy(
      sqrClaimFactory,
      getContractArgs(deployData?.sqrToken ?? ''),
      OPTIONS,
    )) as unknown as SQRClaim;
  }

  const sqrClaimAddress = await ownerSQRClaim.getAddress();

  const user1SQRClaim = ownerSQRClaim.connect(user1);
  const user2SQRClaim = ownerSQRClaim.connect(user2);
  const user3SQRClaim = ownerSQRClaim.connect(user3);
  const owner2SQRClaim = ownerSQRClaim.connect(owner2);

  return {
    sqrClaimFactory,
    sqrClaimAddress,
    ownerSQRClaim,
    user1SQRClaim,
    user2SQRClaim,
    user3SQRClaim,
    owner2SQRClaim,
  };
}

export async function getContext(
  sqrTokenAddress: string,
  sqrClaimAddress: string,
): Promise<ContextBase> {
  const users = await getUsers();
  const sqrTokenContext = await getSQRTokenContext(users, sqrTokenAddress);
  const sqrClaimContext = await getSQRClaimContext(users, sqrClaimAddress);

  return {
    ...users,
    ...sqrTokenContext,
    ...sqrClaimContext,
  };
}

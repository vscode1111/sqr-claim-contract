import { DeployProxyOptions } from '@openzeppelin/hardhat-upgrades/dist/utils';
import { ethers, upgrades } from 'hardhat';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { getNetworkName } from '~common';
import { WEB3_CLAIM_NAME, WEB3_TOKEN_NAME, TOKENS } from '~constants';
import { ContractConfig, getContractArgs, getTokenArgs } from '~seeds';
import { WEB3Claim } from '~typechain-types/contracts/WEB3Claim';
import { WEB3Token } from '~typechain-types/contracts/WEB3Token';
import { WEB3Claim__factory } from '~typechain-types/factories/contracts/WEB3Claim__factory';
import { WEB3Token__factory } from '~typechain-types/factories/contracts/WEB3Token__factory';
import {
  Addresses,
  ContextBase,
  DeployNetworks,
  WEB3ClaimContext,
  WEB3TokenContext,
  Users,
} from '~types';

const OPTIONS: DeployProxyOptions = {
  initializer: 'initialize',
  kind: 'uups',
};

export function getAddresses(network: keyof DeployNetworks): Addresses {
  const web3ClaimAddress = TOKENS.WEB3_CLAIM[network];
  return {
    web3ClaimAddress,
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

export async function getWEB3TokenContext(
  users: Users,
  deployData?: string | { newOnwer: string },
): Promise<WEB3TokenContext> {
  const { owner, user1, user2, user3, owner2, owner2Address } = users;

  const web3TokenFactory = (await ethers.getContractFactory(
    WEB3_TOKEN_NAME,
  )) as any as WEB3Token__factory;

  let ownerWEB3Token: WEB3Token;

  if (typeof deployData === 'string') {
    ownerWEB3Token = web3TokenFactory.connect(owner).attach(deployData) as WEB3Token;
  } else {
    const newOnwer = deployData?.newOnwer ?? owner2Address;
    ownerWEB3Token = await web3TokenFactory.connect(owner).deploy(...getTokenArgs(newOnwer));
  }

  const web3TokenAddress = await ownerWEB3Token.getAddress();

  const user1WEB3Token = ownerWEB3Token.connect(user1);
  const user2WEB3Token = ownerWEB3Token.connect(user2);
  const user3WEB3Token = ownerWEB3Token.connect(user3);
  const owner2WEB3Token = ownerWEB3Token.connect(owner2);

  return {
    web3TokenAddress,
    ownerWEB3Token,
    user1WEB3Token,
    user2WEB3Token,
    user3WEB3Token,
    owner2WEB3Token,
  };
}

export async function getWEB3ClaimContext(
  users: Users,
  deployData?: string | ContractConfig,
): Promise<WEB3ClaimContext> {
  const { owner, user1, user2, user3, owner2 } = users;

  const web3ClaimFactory = (await ethers.getContractFactory(
    WEB3_CLAIM_NAME,
  )) as unknown as WEB3Claim__factory;
  const owner2Web3ClaimFactory = (await ethers.getContractFactory(
    WEB3_CLAIM_NAME,
    owner2,
  )) as unknown as WEB3Claim__factory;

  let ownerWEB3Claim: WEB3Claim;

  if (typeof deployData === 'string') {
    ownerWEB3Claim = web3ClaimFactory.connect(owner).attach(deployData) as WEB3Claim;
  } else {
    ownerWEB3Claim = (await upgrades.deployProxy(
      web3ClaimFactory,
      getContractArgs(
        deployData?.newOwner ?? '',
        deployData?.web3Token ?? '',
        deployData?.claimDelay ?? 0,
      ),
      OPTIONS,
    )) as unknown as WEB3Claim;
  }

  const web3ClaimAddress = await ownerWEB3Claim.getAddress();

  const user1WEB3Claim = ownerWEB3Claim.connect(user1);
  const user2WEB3Claim = ownerWEB3Claim.connect(user2);
  const user3WEB3Claim = ownerWEB3Claim.connect(user3);
  const owner2WEB3Claim = ownerWEB3Claim.connect(owner2);

  return {
    web3ClaimFactory,
    owner2Web3ClaimFactory,
    web3ClaimAddress,
    user1WEB3Claim,
    user2WEB3Claim,
    user3WEB3Claim,
    ownerWEB3Claim,
    owner2WEB3Claim,
  };
}

export async function getContext(
  web3TokenAddress: string,
  web3ClaimAddress: string,
): Promise<ContextBase> {
  const users = await getUsers();
  const web3TokenContext = await getWEB3TokenContext(users, web3TokenAddress);
  const web3ClaimContext = await getWEB3ClaimContext(users, web3ClaimAddress);

  return {
    ...users,
    ...web3TokenContext,
    ...web3ClaimContext,
  };
}

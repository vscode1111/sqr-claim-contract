import { Signer } from 'ethers';
import { WEB3Claim } from '~typechain-types/contracts/WEB3Claim';
import { WEB3Token } from '~typechain-types/contracts/WEB3Token';
import { WEB3Claim__factory } from '~typechain-types/factories/contracts/WEB3Claim__factory';

export interface Users {
  owner: Signer;
  ownerAddress: string;
  user1: Signer;
  user1Address: string;
  user2: Signer;
  user2Address: string;
  user3: Signer;
  user3Address: string;
  owner2: Signer;
  owner2Address: string;
}

export interface WEB3TokenContext {
  web3TokenAddress: string;
  ownerWEB3Token: WEB3Token;
  user1WEB3Token: WEB3Token;
  user2WEB3Token: WEB3Token;
  user3WEB3Token: WEB3Token;
  owner2WEB3Token: WEB3Token;
}

export interface WEB3ClaimContext {
  web3ClaimFactory: WEB3Claim__factory;
  owner2Web3ClaimFactory: WEB3Claim__factory;
  web3ClaimAddress: string;
  user1WEB3Claim: WEB3Claim;
  user2WEB3Claim: WEB3Claim;
  user3WEB3Claim: WEB3Claim;
  ownerWEB3Claim: WEB3Claim;
  owner2WEB3Claim: WEB3Claim;
}

export type ContextBase = Users & WEB3TokenContext & WEB3ClaimContext;

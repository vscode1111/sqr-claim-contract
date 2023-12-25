import { Signer } from 'ethers';
import { SQRClaim } from '~typechain-types/contracts/SQRClaim';
import { SQRToken } from '~typechain-types/contracts/SQRToken';
import { SQRClaim__factory } from '~typechain-types/factories/contracts/SQRClaim__factory';

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

export interface SQRTokenContext {
  sqrTokenAddress: string;
  ownerSQRToken: SQRToken;
  user1SQRToken: SQRToken;
  user2SQRToken: SQRToken;
  user3SQRToken: SQRToken;
  owner2SQRToken: SQRToken;
}

export interface SQRClaimContext {
  sqrClaimFactory: SQRClaim__factory;
  owner2SqrClaimFactory: SQRClaim__factory;
  sqrClaimAddress: string;
  user1SQRClaim: SQRClaim;
  user2SQRClaim: SQRClaim;
  user3SQRClaim: SQRClaim;
  ownerSQRClaim: SQRClaim;
  owner2SQRClaim: SQRClaim;
}

export type ContextBase = Users & SQRTokenContext & SQRClaimContext;

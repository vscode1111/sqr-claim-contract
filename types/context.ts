import { Signer } from "ethers";
import { SQRClaim } from "~typechain-types/contracts/SQRClaim";
import { SQRToken } from "~typechain-types/contracts/SQRToken";

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
  coldWallet: Signer;
  coldWalletAddress: string;
}

export interface SQRTokenContext {
  sqrTokenAddress: string;
  ownerSQRToken: SQRToken;
  user1SQRToken: SQRToken;
  user2SQRToken: SQRToken;
  user3SQRToken: SQRToken;
  owner2SQRToken: SQRToken;
  coldWalletSQRToken: SQRToken;
}

export interface SQRClaimContext {
  sqrClaimAddress: string;
  ownerSQRClaim: SQRClaim;
  user1SQRClaim: SQRClaim;
  user2SQRClaim: SQRClaim;
  user3SQRClaim: SQRClaim;
  owner2SQRClaim: SQRClaim;
  coldWalletSQRClaim: SQRClaim;
}

export type ContextBase = Users & SQRTokenContext & SQRClaimContext;

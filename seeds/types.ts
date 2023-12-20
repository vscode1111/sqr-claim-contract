export interface ContractConfig {
  newOwner: string;
  sqrToken: string;
  claimDelay: number;
}

export type DeployContractArgs = [newOwner: string, sqrToken: string, claimDelay: number];

export interface TokenConfig {
  name: string;
  symbol: string;
  newOwner: string;
  initMint: bigint;
  decimals: number;
}

export type DeployTokenArgs = [
  name_: string,
  symbol_: string,
  newOwner: string,
  initMint: bigint,
  decimals_: bigint | number,
];

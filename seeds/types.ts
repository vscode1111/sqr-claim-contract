export interface ContractConfig {
  newOwner: string;
  web3Token: string;
  claimDelay: number;
}

export type DeployContractArgs = [newOwner: string, web3Token: string, claimDelay: number];

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

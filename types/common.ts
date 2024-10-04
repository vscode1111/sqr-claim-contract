export interface DeployNetworks {
  bsc: string;
  bscTestnet: string;
}

export interface Addresses {
  web3ClaimAddress: string;
}

export type StringNumber = string | number;

export type DeployNetworkKey = keyof DeployNetworks;

export interface DeployNetworks {
  bsc: string;
  bscTestnet: string;
}

export interface Addresses {
  sqrClaimAddress: string;
}

export type StringNumber = string | number;

export type DeployNetworkKey = keyof DeployNetworks;

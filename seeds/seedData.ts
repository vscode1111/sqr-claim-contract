import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import { keccak256FromStr, toUnixTime, toWei } from '~common';
import { DeployNetworkKey } from '~types';
import { defaultNetwork } from '../hardhat.config';
import { ContractConfig, DeployContractArgs, DeployTokenArgs, TokenConfig } from './types';

const chainDecimals: Record<DeployNetworkKey, number> = {
  bsc: 8,
  bscTestnet: 8,
};

export const web3Decimals = chainDecimals[defaultNetwork];

const isTest = true; //false - PROD!

if (!isTest) {
  throw 'Are you sure? It is PROD!';
}

// export const prodContractConfig: Partial<ContractConfig> = {
//   newOwner: '0xA8B8455ad9a1FAb1d4a3B69eD30A52fBA82549Bb', //Matan
//   web3Token: '0x2B72867c32CF673F7b02d208B26889fEd353B1f8', //WEB3
// };

export const prodContractConfig: Partial<ContractConfig> = {
  newOwner: '0x1D5eeCbD950C22Ec2B5813Ab1D65ED5fFD83F32B', //My
  web3Token: '0x2B72867c32CF673F7b02d208B26889fEd353B1f8', //WEB3
};

// BSC
export const testContractConfig: Partial<ContractConfig> = {
  newOwner: '0x1D5eeCbD950C22Ec2B5813Ab1D65ED5fFD83F32B', //My
  web3Token: '0x4072b57e9B3dA8eEB9F8998b69C868E9a1698E54', //tWEB3
};

//BSC Testnet
// export const testContractConfig: Partial<ContractConfig> = {
//   newOwner: '0x1D5eeCbD950C22Ec2B5813Ab1D65ED5fFD83F32B', //My
//   web3Token: '0xCcB42cab629888dEe357a20FB373dd2337ab85db', //testName12
// };

const extContractConfig = isTest ? testContractConfig : prodContractConfig;

export const contractConfig: ContractConfig = {
  newOwner: 'empty',
  web3Token: 'empty',
  claimDelay: 1 * 24 * 3600,
  ...extContractConfig,
};

export function getContractArgs(
  newOwner: string,
  web3Token: string,
  claimDelay: number,
): DeployContractArgs {
  return [newOwner, web3Token, claimDelay];
}

export const tokenConfig: TokenConfig = {
  name: 'empty',
  symbol: 'empty',
  newOwner: '0x81aFFCB2FaCEcCaE727Fa4b1B2ef534a1Da67791',
  initMint: toWei(1_000_000_000, web3Decimals),
  decimals: web3Decimals,
};

export function getTokenArgs(newOnwer: string): DeployTokenArgs {
  return [
    tokenConfig.name,
    tokenConfig.symbol,
    newOnwer,
    tokenConfig.initMint,
    tokenConfig.decimals,
  ];
}

const priceDiv = BigInt(1000);
const userInitBalance = toWei(100, web3Decimals);
const amount1 = toWei(0.123, web3Decimals) / priceDiv;
const extraAmount1 = toWei(25.32, web3Decimals) / priceDiv;
const transactionId0 = uuidv4();
const transactionId1 = uuidv4();

export const seedData = {
  zero: toWei(0),
  userInitBalance,
  totalAccountBalance: tokenConfig.initMint,
  amount1,
  amount2: amount1 / BigInt(2),
  extraAmount1: extraAmount1,
  extraAmount2: extraAmount1 / BigInt(2),
  now: toUnixTime(),
  nowPlus1m: toUnixTime(dayjs().add(1, 'minute').toDate()),
  nowPlus1d: toUnixTime(dayjs().add(1, 'day').toDate()),
  nowPlus1d1m: toUnixTime(dayjs().add(1, 'day').add(1, 'minute').toDate()),
  nowPlus1d2m: toUnixTime(dayjs().add(1, 'day').add(2, 'minute').toDate()),
  timeDelta: 300,
  transactionId0: transactionId0,
  transactionId1: transactionId1,
  transactionIdHash0: keccak256FromStr(transactionId0),
  transactionIdHash1: keccak256FromStr(transactionId1),
  claimDelay: 2 * 24 * 3600,
};

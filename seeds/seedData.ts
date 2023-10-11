import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import { keccak256FromStr, toUnixTime, toWei } from '~common';
import { DeployNetworkKey } from '~types';
import { defaultNetwork } from '../hardhat.config';
import { ContractConfig, DeployContractArgs, DeployTokenArgs, TokenConfig } from './types';

const chainDecimals: Record<DeployNetworkKey, number> = {
  bnb: 8,
  polygon: 8,
};

export const sqrDecimals = chainDecimals[defaultNetwork];

const isTest = true; //false - PROD!

if (!isTest) {
  throw 'Are you sure? It is PROD!';
}

export const prodContractConfig: Partial<ContractConfig> = {
  sqrToken: '',
};

export const testContractConfig: Partial<ContractConfig> = {
  // sqrToken: '0xCD56577757277861034560D5f166aEB68C4844FB', //My - testName12
  sqrToken: '0x4072b57e9B3dA8eEB9F8998b69C868E9a1698E54', //tSQR
};

const extContractConfig = isTest ? testContractConfig : prodContractConfig;

export const contractConfig: ContractConfig = {
  sqrToken: '',
  ...extContractConfig,
};

export function getContractArgs(sqrToken: string): DeployContractArgs {
  return [sqrToken];
}

export const tokenConfig: TokenConfig = {
  name: 'empty',
  symbol: 'empty',
  newOwner: '0x81aFFCB2FaCEcCaE727Fa4b1B2ef534a1Da67791',
  initMint: toWei(1_000_000_000, sqrDecimals),
  decimals: sqrDecimals,
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

const priceDiv = BigInt(1);
const userInitBalance = toWei(100, sqrDecimals);
const amount1 = toWei(1.123, sqrDecimals) / priceDiv;
const extraAmount1 = toWei(25.32, sqrDecimals) / priceDiv;
const transationId0 = uuidv4();
const transationId1 = uuidv4();

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
  // nowPlus1m: toUnixTime(dayjs().add(0, 'seconds').toDate()),
  timeDelta: 300,
  transationId0,
  transationId1,
  transationIdHash0: keccak256FromStr(transationId0),
  transationIdHash1: keccak256FromStr(transationId1),
};

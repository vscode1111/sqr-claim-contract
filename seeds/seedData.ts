import { BigNumberish } from "ethers";
import { toUnixTime, toWei } from "~common";
import { DeployNetworkKey } from "~types";

import { defaultNetwork } from "../hardhat.config";
import { ContractConfig, DeployContractArgs, DeployTokenArgs, TokenConfig } from "./types";

const chainDecimals: Record<DeployNetworkKey, number> = {
  bnb: 8,
  polygon: 8,
};

export const sqrDecimals = chainDecimals[defaultNetwork];

const isTest = true; //false - PROD!

if (!isTest) {
  throw "Are you sure? It is PROD!";
}

export const prodContractConfig: Partial<ContractConfig> = {
  sqrToken: "",
  coldWallet: "",
};

export const testContractConfig: Partial<ContractConfig> = {
  newOwner: "0x1D5eeCbD950C22Ec2B5813Ab1D65ED5fFD83F32B",
  sqrToken: "0xCD56577757277861034560D5f166aEB68C4844FB", //My - testName12
  coldWallet: "0xAca11c3Dde62ACdffE8d9279fDc8AFDD945556A7",
  balanceLimit: toWei(1000, sqrDecimals),
};

const extContractConfig = isTest ? testContractConfig : prodContractConfig;

export const contractConfig: ContractConfig = {
  newOwner: "0x81aFFCB2FaCEcCaE727Fa4b1B2ef534a1Da67791",
  sqrToken: "",
  coldWallet: "0x81aFFCB2FaCEcCaE727Fa4b1B2ef534a1Da67791",
  balanceLimit: toWei(1000, sqrDecimals),
  ...extContractConfig,
};

export function getContractArgs(
  newOwner: string,
  sqrToken: string,
  coldWallet: string,
  balanceLimit: BigNumberish,
): DeployContractArgs {
  return [newOwner, sqrToken, coldWallet, balanceLimit];
}

export const tokenConfig: TokenConfig = {
  name: "empty",
  symbol: "empty",
  newOwner: "0x81aFFCB2FaCEcCaE727Fa4b1B2ef534a1Da67791",
  initMint: toWei(1_000_000_000, sqrDecimals),
  decimals: sqrDecimals,
};

export function getTokenArgs(newOnwer: string): DeployTokenArgs {
  return [tokenConfig.name, tokenConfig.symbol, newOnwer, tokenConfig.initMint, tokenConfig.decimals];
}

const priceDiv = BigInt(1);
const userInitBalance = toWei(10_000, sqrDecimals);
const deposit1 = toWei(100, sqrDecimals) / priceDiv;
const withdraw1 = toWei(30, sqrDecimals) / priceDiv;
const remains1 = deposit1 - withdraw1;
const extraDeposit1 = toWei(2500, sqrDecimals) / priceDiv;
const owner2Withdraw = toWei(300, sqrDecimals);
// const exptraWithdraw1 = toWei(1000, sqrDecimals) / priceDiv;

export const seedData = {
  zero: toWei(0),
  userInitBalance,
  totalAccountBalance: tokenConfig.initMint,
  deposit1,
  withdraw1,
  remains1,
  deposit2: deposit1 / BigInt(2),
  withdraw2: withdraw1 / BigInt(2),
  remains2: remains1 / BigInt(2),
  extraDeposit1,
  extraDeposit2: extraDeposit1 / BigInt(2),
  owner2Withdraw,
  now: toUnixTime(),
  timeDelta: 300,
};

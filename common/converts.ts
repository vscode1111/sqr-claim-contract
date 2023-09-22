import { BigNumberish, formatEther, formatUnits, parseUnits } from "ethers";

export function toWei(value: BigNumberish, unitName?: BigNumberish): bigint {
  return BigInt(parseUnits(String(value), unitName));
}

export function toNumber(value: BigNumberish, factor = 1): number {
  return Number(formatEther(value)) * factor;
}

export function toNumberDecimals(value: BigNumberish, decimals = BigInt(18)): number {
  return Number(formatUnits(value, decimals));
}

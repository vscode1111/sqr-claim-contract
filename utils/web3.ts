import { TransactionReceipt } from 'ethers';

export function findEvent<T>(receipt: TransactionReceipt) {
  return receipt.logs.find((log: any) => log.fragment) as T;
}

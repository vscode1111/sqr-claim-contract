import { contractConfig, getContractArgs } from '~seeds';
import { verifyArgsRequired } from './deployData';

export function getContractArgsEx() {
  return verifyArgsRequired
    ? getContractArgs(contractConfig.newOwner, contractConfig.web3Token, contractConfig.claimDelay)
    : undefined;
}

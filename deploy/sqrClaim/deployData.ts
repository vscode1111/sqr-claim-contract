import { toUnixTime } from '~common';

export const verifyRequired = false;
export const verifyArgsRequired = false;

export const deployData = {
  now: toUnixTime(),
  userMintAmount: 100000,
  claimDelay: 1 * 24 * 3600,
};

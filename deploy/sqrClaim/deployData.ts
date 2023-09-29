import { toUnixTime } from '~common';

export const verifyRequired = false;
export const verifyArgsRequired = false;

export const deployData = {
  now: toUnixTime(),
  nullAddress: '0x0000000000000000000000000000000000000000',
  userMintAmount: 100000,
};

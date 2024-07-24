import { DeployNetworks } from '~types';

export const SQR_CLAIM_NAME = 'SQRClaim';
export const SQR_TOKEN_NAME = 'SQRToken';

export enum CONTRACT_LIST {
  SQR_CLAIM = 'SQR_CLAIM',
}

export const TOKENS: Record<CONTRACT_LIST, DeployNetworks> = {
  SQR_CLAIM: {
    // bsc: '0x06Cd8543cD076807d4F2B3bF67069015206FA9e9', //My
    // bsc: '0x1635A6Bc428F4912c32088313A279605198EA29d', //My2
    // bsc: '0xe25002544E53a63f2b3003Ec14AA4a4a18472207', //My3
    // bsc: '0x729B852e45D838280b22E2aA7cd1896da1bae5Df', //My3
    bsc: '0x53429B29b05AE7212341DD3d64e33e11F967f71B', //Main
    // bsc: '0x1BDd0f4860c7aC88264A9e596da776ACbf2aEBe4', //Prod
    // bsc: '0x5e8bE5D6228d1d50C178940D2CE0696A92350Ac1', //My-SQR
    // bsc: '0x36132Bf3A6F36f31bFab7b72D493d3396eb6fC08', //My-tSQR
    bscTestnet: '0xfb3F5F6725436B0Afccfe5c0fbD0F8751C2C2677', //My
  },
};

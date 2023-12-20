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
    bsc: '0x53429B29b05AE7212341DD3d64e33e11F967f71B', //My4
    polygon: '',
  },
};

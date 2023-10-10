import { DeployNetworks } from '~types';

export const SQR_CLAIM_NAME = 'SQRClaim';
export const SQR_TOKEN_NAME = 'SQRToken';

export enum CONTRACT_LIST {
  SQR_CLAIM = 'SQR_CLAIM',
}

export const TOKENS: Record<CONTRACT_LIST, DeployNetworks> = {
  SQR_CLAIM: {
    // bnb: '0x06Cd8543cD076807d4F2B3bF67069015206FA9e9', //My
    // bnb: '0x1635A6Bc428F4912c32088313A279605198EA29d', //My2
    bnb: '0xe25002544E53a63f2b3003Ec14AA4a4a18472207', //My3
    polygon: '',
  },
};

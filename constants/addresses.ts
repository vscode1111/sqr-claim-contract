import { DeployNetworks } from "~types";

export const SQR_CLAIM_NAME = "SQRClaim";
export const SQR_TOKEN_NAME = "SQRToken";

export enum CONTRACT_LIST {
  SQR_CLAIM = "SQR_CLAIM",
}

export const TOKENS: Record<CONTRACT_LIST, DeployNetworks> = {
  SQR_CLAIM: {
    bnb: "0x06Cd8543cD076807d4F2B3bF67069015206FA9e9", //My
    polygon: "",
  },
};

import { DeployNetworks } from "~types";

export const SQR_CLAIM_NAME = "SQRClaim";
export const SQR_TOKEN_NAME = "SQRToken";

export enum CONTRACT_LIST {
  SQR_CLAIM = "SQR_CLAIM",
}

export const TOKENS: Record<CONTRACT_LIST, DeployNetworks> = {
  SQR_CLAIM: {
    bnb: "0xfb61661997197D592549deeC84A923d660BE8BcB", //My
    polygon: "",
  },
};

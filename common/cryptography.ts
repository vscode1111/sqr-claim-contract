import { getBytes, keccak256, solidityPackedKeccak256 } from "ethers";
import { MerkleTree } from "merkletreejs";

export function keccak256FromStr(data: string) {
  return keccak256(getBytes(data));
}

interface Signer {
  signMessage(message: string | ArrayLike<number>): Promise<string>;
}

export async function signMessage(signer: Signer, types: readonly string[], values: readonly any[]) {
  const hash = solidityPackedKeccak256(types, values);
  const messageHashBin = hash;
  return signer.signMessage(messageHashBin);
}

export function getMerkleRootHash(whitelist: string[]) {
  let leaves = whitelist.map((addr) => keccak256(addr));
  const merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });
  return merkleTree.getHexRoot();
}

export function getMerkleProofs(whitelist: string[], account: string) {
  let leaves = whitelist.map((addr) => keccak256(addr));
  const merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });
  let hashedAddress = keccak256(account);
  return merkleTree.getHexProof(hashedAddress);
}

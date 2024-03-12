import { MerkleDistributorSDK } from "../src/sdk";
import { PublicKey } from "@solana/web3.js";
import { u64 } from "@saberhq/token-utils";
import { buildTree, setupEnv } from "./cli-helpers";
import snapshot from '../data/airdrop-amounts.json'
import { chaiSolana, expectTX } from "@saberhq/chai-solana";
import chai, { expect } from "chai";
chai.use(chaiSolana);

const distributor = new PublicKey("EgN7JjfZamr3Zmdy9tP8eLxzgX6dkibrLLAJrNGRupJc");

var claim = async () => {
  const { provider } = setupEnv();
  const sdk = MerkleDistributorSDK.load({ provider });
  const { tree } = buildTree();
  try {
    const distributorW = await sdk.loadDistributor(distributor);
    let userIndex = 0;
    let user = Object(snapshot[userIndex]);
    const tx = await distributorW.claimByAdmin({
      index: new u64(userIndex),
      amount: new u64(user.amount),
      proof: tree.getProof(userIndex, new PublicKey(user.authority), new u64(user.amount)),
      claimant: new PublicKey(user.authority),
    });
    const pendingTx = await tx.confirm();
    console.log("signature: ", pendingTx.signature)
  } catch (e) {
    console.log(e)
  }
}

claim()
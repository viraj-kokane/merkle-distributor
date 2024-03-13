import { MerkleDistributorSDK } from "../src/sdk";
import { PublicKey } from "@solana/web3.js";
import { u64 } from "@saberhq/token-utils";
import { buildTree, setupEnv } from "./cli-helpers";
import snapshot from '../data/airdrop-amounts.json'
import { chaiSolana } from "@saberhq/chai-solana";
import chai from "chai";
chai.use(chaiSolana);

const distributor = new PublicKey("HqCt7BSMBnvHSn5FiUgD2gHhAVg6yRiZeFx27auvFNgU");

var claim = async () => {
  const { provider } = setupEnv();
  const sdk = MerkleDistributorSDK.load({ provider });
  const { tree } = buildTree();
  try {
    const distributorW = await sdk.loadDistributor(distributor);
    let userIndex = 2;
    let user = Object(snapshot[userIndex]);
    console.log("old proof", tree.getProof(userIndex, new PublicKey(user.authority), new u64(user.amount)));
    const proof = [
        Buffer.from(
          "42d64d043ee797e9ba8fa4410525711fccab61121c5ad30ff228371bac44cb3d",
          "hex"
        ),
        Buffer.from(
          "8745d4bfd3c39dc3ad413315ccdb772a6780b0bff4703b653f3ed1e2f5b6e389",
          "hex"
        ),
      ];
    //   console.log('\x1b[33m new proof! \x1b[0m', proof);
    const tx = await distributorW.claim({
      index: new u64(userIndex),
      amount: new u64(user.amount),
    //   proof: tree.getProof(userIndex, new PublicKey(user.authority), new u64(user.amount)),
        proof: proof,
      claimant: new PublicKey(user.authority),
    });
    const pendingTx = await tx.confirm();
    console.log("signature: ", pendingTx.signature)
  } catch (e) {
    console.log(e)
  }
}

claim()
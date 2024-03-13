import { u64 } from "@saberhq/token-utils";
import bs58 from "bs58";
import { writeFileSync } from "fs";

const main = async () => {
    try {
        let x = new u64(3);
        console.log(x); // wallet 3
        // Decode base58 string
        let b = bs58.decode('0x00'); // Replace with your private key from phantom or other wallet to generate keygen file

        // Convert to Uint8Array
        let j = new Uint8Array(b.buffer, b.byteOffset, b.byteLength / Uint8Array.BYTES_PER_ELEMENT);

        // Write to file
        writeFileSync(`key.json`, JSON.stringify(Array.from(j)));
        console.log('File written successfully.');
    } catch (error) {
        console.error('Error:', error);
    }
}

main();

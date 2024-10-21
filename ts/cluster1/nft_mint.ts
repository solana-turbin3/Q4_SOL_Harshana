import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createSignerFromKeypair, signerIdentity, generateSigner, percentAmount } from "@metaplex-foundation/umi"
import { createNft, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";

import wallet from "/Users/harshanaprajapati/Q4_SOL_Harshana/ts/cluster1/wallet/dev-wallet.json"
import base58 from "bs58";

const RPC_ENDPOINT = "https://api.devnet.solana.com";
const umi = createUmi(RPC_ENDPOINT);

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner));
umi.use(mplTokenMetadata())
const sellerFeeBasisPoints = percentAmount(0, 2);
const mint = generateSigner(umi);

const name = "JOON";
const uri = "https://devnet.irys.xyz/7tcPjvq1QAtKHRtTxhqNB5Dr9aSKKqe32ofGBMg3u5YG";
const symbol = "JN";

(async () => {
    let tx = createNft(umi, {
        mint, 
        name, 
        symbol,
        uri,
        sellerFeeBasisPoints
    });
    let result = await tx.sendAndConfirm(umi);
    const signature = base58.encode(result.signature);
    
    console.log(`Succesfully Minted! Check out your TX here:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`)

    console.log("Mint Address: ", mint.publicKey);
})();
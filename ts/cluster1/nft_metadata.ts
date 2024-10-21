import wallet from "/Users/harshanaprajapati/Q4_SOL_Harshana/ts/cluster1/wallet/dev-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
    try {
        // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure

        const image = "https://devnet.irys.xyz/CD9VqsZA4JkQvxy7WbdJRF383PAtWjZBkmn4xRfBF8nj"
        const metadata = {
            name: "JOON",
            symbol: "JN",
            description: "A rug nft created by Joon",
            image,
            attributes: [
                {trait_type: 'fabric', value: 'muslin'},
                {trait_type: 'color', value: 'warm_pink'},
            ],
            properties: {
                files: [
                    {
                        type: "image/png",
                        uri: image
                    },
                ]
            },
            creators: [
                {
                    address: keypair.publicKey, 
                    share: 10
                }
            ]
        };
        let myUri = await umi.uploader.uploadJson(metadata)
        myUri = myUri.replace("arweave.net", "devnet.irys.xyz")
        console.log("Your metadata URI: ", myUri);
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();

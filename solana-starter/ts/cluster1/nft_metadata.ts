import wallet from "../cluster1/wallet/dev-wallet.json"
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
        // Follow this JSON structure
        // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure

        const image = 'https://arweave.net/7aoW1Qzp8RAPge4MviikoQCWsEsCc5AZ8Gj1mRj7hUbV'
        const metadata = {
            name: "Best-NFT",
            symbol: "BFT",
            description: "The best nft your money can buy",
            image: image,
            attributes: [
                { trait_type: 'Illustraction', value: 'smoky' }
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
                    share: 100
                }

            ]
        };
        const genFile = createGenericFile(JSON.stringify(metadata), "img-1")
        const [myUri] = await umi.uploader.upload([genFile])
        console.log("Your metadata URI: ", myUri);
        //result - https://arweave.net/5L2td32oxxj8CvGf8cySKxVYU4469tnAE6Yu4MM37GF3
    }
    catch (error) {
        console.log("Oops.. Something went wrong", error);
    }
})();

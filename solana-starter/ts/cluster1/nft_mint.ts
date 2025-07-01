import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createSignerFromKeypair, signerIdentity, generateSigner, percentAmount } from "@metaplex-foundation/umi"
import { createNft, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";

import wallet from "../cluster1/wallet/dev-wallet.json"
import base58 from "bs58";

const RPC_ENDPOINT = "https://api.devnet.solana.com";
const umi = createUmi(RPC_ENDPOINT);

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner));
umi.use(mplTokenMetadata())

const mint = generateSigner(umi);

(async () => {
    let tx = await createNft(umi, {
        mint: mint,
        name: "Best-NFT",
        symbol: "BFT",
        uri: "https://devnet.irys.xyz/5L2td32oxxj8CvGf8cySKxVYU4469tnAE6Yu4MM37GF3",
        sellerFeeBasisPoints: percentAmount(5)

    });
    let result = await tx.sendAndConfirm(umi);
    const signature = base58.encode(result.signature);

    console.log(`Succesfully Minted! Check out your TX here:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`)
    //result - https://explorer.solana.com/tx/41XcPSsbsU4MpXCYJpu26KAmDFGkEPZTs17VyZucYScqpMnF8QQcH5ikyRPAGi55rnJJ6xhrXkSeLHXKaFkm83EH?cluster=devnet

    console.log("Mint Address: ", mint.publicKey);
    //result - 9Z7BcGUD6v8TNFpqZ1QTKvqUEb6wLz2VYVUSqSQAxHVz
})();
import { Keypair, Connection, Commitment } from "@solana/web3.js";
import { createMint } from '@solana/spl-token';
import wallet from "../cluster1/wallet/dev-wallet.json"

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

(async () => {
    try {
        // Start here
        console.log("Pubkey:\n",keypair.publicKey)
        //pubkey - EcgxCCyx5YrFTN6WeQ9ioX6CGZVgWsbyXxzNSAZDzdVT
        const mint = await createMint(connection,keypair,keypair.publicKey,keypair.publicKey,6);
        console.log("Created mint is:", mint)
    } catch(error) {
        console.log(`Oops, something went wrong: ${error}`)
    }
})()

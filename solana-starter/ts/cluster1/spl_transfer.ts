import { Commitment, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import wallet from "../cluster1/wallet/dev-wallet.json"
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("8xRpbEr3BnWpDaTFg44HCWr28WTYwrDEHdMhgv9tTpos");

// Recipient address
const to = new PublicKey("AdkKhs45BQjtJxE3Pn99H1D7SkTEKfQpgp9RmQxUX5JE");

(async () => {
    try {
        // Get the token account of the fromWallet address, and if it does not exist, create it
        const fromWalletTokenAcc = await getOrCreateAssociatedTokenAccount(connection, keypair, mint, keypair.publicKey)

        // Get the token account of the toWallet address, and if it does not exist, create it
        const toWalletTokenAcc = await getOrCreateAssociatedTokenAccount(connection, keypair, mint, to)

        // Transfer the new token to the "toTokenAccount" we just created
        const transferToken = await transfer(connection, keypair, fromWalletTokenAcc.address, toWalletTokenAcc.address, keypair, 1)

        console.log("NFT TRANSFERRED:", transferToken)
        //result - 5QSpB2FcAcrgD78x1wmnVL2HQziEQGeHtg41C6SzZFaVpjnq1BEDCDc3t1tRXbp6LjS9hecQzatcDJT6MCCkxx73
    } catch (e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();
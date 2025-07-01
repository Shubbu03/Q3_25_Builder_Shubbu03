import { Connection, Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { Program, Wallet, AnchorProvider } from "@coral-xyz/anchor";
import { IDL, Turbin3Prereq } from "./programs/Turbin3_prereq";
import wallet from "./Turbin3-wallet.json";
const MPL_CORE_PROGRAM_ID = new PublicKey(
  "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d"
);

// Import our dev wallet keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));
// Define our Turbin3 public key
// const to = new PublicKey("87eaezi5Nou5d5MFH2DStENzWZ6iHNroDHZSbSca4RDu");

const connection = new Connection("https://api.devnet.solana.com");

// Create our anchor provider
const provider = new AnchorProvider(connection, new Wallet(keypair), {
  commitment: "confirmed",
});

// const programId = new PublicKey("TRBZyQHB3m68FGeVsqTK39Wm4xejadjVhP5MAZaKWDM");
//create program
const program: Program<Turbin3Prereq> = new Program(IDL, provider);

const [account_key, _account_bump] = PublicKey.findProgramAddressSync(
  [Buffer.from("prereqs"), keypair.publicKey.toBuffer()],
  program.programId
);

const mintCollection = new PublicKey(
  "5ebsp5RChCGK7ssRZMVMufgVZhd2kFbNaotcZ5UvytN2"
);
const mintTs = Keypair.generate();

const [authority] = PublicKey.findProgramAddressSync(
  [Buffer.from("collection"), mintCollection.toBuffer()],
  program.programId
);

// (async () => {
//   try {
//     const txhash = await program.methods
//       .initialize("Shubbu03") // replace with your GitHub handle
//       .accountsPartial({
//         user: keypair.publicKey,
//         account: account_key,
//         system_program: SystemProgram.programId,
//       })
//       .signers([keypair])
//       .rpc();

//     console.log(
//       `Initialize TX: https://explorer.solana.com/tx/${txhash}?cluster=devnet`
//     );
//   } catch (e) {
//     console.error("Initialize failed:", e);
//   }
// })();

// Execute the submitTs transaction
(async () => {
  try {
    const txhash = await program.methods
      .submitTs()
      .accountsPartial({
        user: keypair.publicKey,
        account: account_key,
        mint: mintTs.publicKey,
        collection: mintCollection,
        authority: authority,
        mpl_core_program: MPL_CORE_PROGRAM_ID,
        system_program: SystemProgram.programId,
      })
      .signers([keypair, mintTs])
      .rpc();
    console.log(`Success! Check out your TX here:
https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();


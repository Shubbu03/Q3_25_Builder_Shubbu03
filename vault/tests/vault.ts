import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Vault } from "../target/types/vault";
import { BN } from "bn.js";
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { confirmTransaction } from "@solana-developers/helpers";
import { expect } from "chai";

describe("vault", () => {
  anchor.setProvider(anchor.AnchorProvider.env());
  const provider = anchor.getProvider();
  const connection = provider.connection;

  const program = anchor.workspace.Vault as Program<Vault>;

  const signer = anchor.web3.Keypair.generate();
  const deposit_amount = new BN(100000);
  const withdraw_amount = new BN(50000);

  let vault: PublicKey;
  let vaultState: PublicKey;

  before(async () => {
    const airdropSig = await connection.requestAirdrop(signer.publicKey, 2 * LAMPORTS_PER_SOL);
    await confirmTransaction(connection, airdropSig, "confirmed");

    [vaultState] = PublicKey.findProgramAddressSync(
      [Buffer.from("state"), signer.publicKey.toBuffer()],
      program.programId
    );

    [vault] = PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), vaultState.toBuffer()],
      program.programId
    );
  });

  it("Initialize", async () => {
    const tx = await program.methods.initialize().accountsPartial({
      signer: signer.publicKey,
      vault,
      vaultState,
      systemProgram: SystemProgram.programId,
    }).signers([signer]).rpc();
    console.log("Your transaction signature", tx);

    const account = await program.account.vaultState.fetch(vaultState);
    expect(account).to.exist;
  });

  it("Deposit", async () => {
    const previousVaultBalance = await connection.getBalance(vault);
    const tx = await program.methods.deposit(deposit_amount).accountsPartial({
      signer: signer.publicKey,
      vault,
      vaultState,
      systemProgram: SystemProgram.programId,
    }).signers([signer]).rpc();
    console.log("Deposit transaction signature", tx);
    const currentVaultBalance = await connection.getBalance(vault);
    expect(currentVaultBalance - previousVaultBalance).to.equal(deposit_amount.toNumber());
  });

  it("Withdraw", async () => {
    const previousVaultBalance = await connection.getBalance(vault);
    const tx = await program.methods.withdraw(withdraw_amount).accountsPartial({
      signer: signer.publicKey,
      vault,
      vaultState,
      systemProgram: SystemProgram.programId,
    }).signers([signer]).rpc();
    console.log("Withdraw transaction signature", tx);
    const currentVaultBalance = await connection.getBalance(vault);
    expect(previousVaultBalance - currentVaultBalance).to.equal(withdraw_amount.toNumber());
  });

  it("Close", async () => {
    const previousVaultBalance = await connection.getBalance(vault);
    const tx = await program.methods.close().accountsPartial({
      signer: signer.publicKey,
      vault,
      vaultState,
      systemProgram: SystemProgram.programId,
    }).signers([signer]).rpc();
    console.log("Close transaction signature", tx);

    const account = await program.account.vaultState.fetchNullable(vaultState);
    expect(account).to.be.null;

    const currentVaultBalance = await connection.getBalance(vault);
    expect(currentVaultBalance).to.equal(previousVaultBalance - previousVaultBalance);
  });
});
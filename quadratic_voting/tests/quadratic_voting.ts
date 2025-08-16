import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js"
import {
  createMint,
  createAccount,
  mintTo,
} from "@solana/spl-token";
import { QuadraticVoting } from "../target/types/quadratic_voting";
import { assert } from "chai";

describe("quadratic_voting", () => {
  anchor.setProvider(anchor.AnchorProvider.env());
  const provider = anchor.getProvider();
  const connection = provider.connection;
  const program = anchor.workspace.quadraticVoting as Program<QuadraticVoting>;

  let creator: Keypair;
  let name: string;
  let daoPda: PublicKey;
  let proposalPda: PublicKey;
  let metadata: string;
  let votePda: PublicKey;
  let mint: PublicKey;
  let voterTokenAccount: PublicKey;

  before(async () => {
    creator = Keypair.generate();
    name = "Company_test";
    metadata = "Metadata_for_company";

    [daoPda] = await PublicKey.findProgramAddressSync(
      [
        Buffer.from("dao"),
        creator.publicKey.toBuffer(),
        Buffer.from(name)
      ],
      program.programId
    );

    await connection.requestAirdrop(creator.publicKey, 2_000_000_000);
    await new Promise((res) => setTimeout(res, 3000));
  })

  it("initializes dao", async () => {

    await program.methods
      .initializeDao(name)
      .accountsPartial({
        creator: creator.publicKey,
        dao: daoPda,
        systemProgram: SystemProgram.programId
      })
      .signers([creator])
      .rpc();

    const daoAccount = await program.account.dao.fetch(daoPda)

    assert.ok(daoAccount.authority.equals(creator.publicKey))
    assert.strictEqual(daoAccount.name, name)
    assert.strictEqual(Number(daoAccount.proposalCount), 0)
  });

  it("initializes proposal", async () => {
    const daoAccount = await program.account.dao.fetch(daoPda);

    [proposalPda] = await PublicKey.findProgramAddressSync(
      [
        Buffer.from("proposal"),
        daoPda.toBuffer(),
        daoAccount.proposalCount.toArrayLike(Buffer, "le", 8)
      ],
      program.programId
    )

    await program.methods
      .initializeProposal(metadata)
      .accountsPartial({
        creator: creator.publicKey,
        dao: daoPda,
        proposal: proposalPda,
        systemProgram: SystemProgram.programId
      })
      .signers([creator])
      .rpc();

    const proposalAccount = await program.account.proposal.fetch(proposalPda);

    assert.ok(proposalAccount.authority.equals(creator.publicKey))
    assert.strictEqual(proposalAccount.metadata, metadata)
    assert.strictEqual(Number(proposalAccount.yesVoteCount), 0)
    assert.strictEqual(Number(proposalAccount.noVoteCount), 0)

    const updatedDao = await program.account.dao.fetch(daoPda);
    assert.strictEqual(Number(updatedDao.proposalCount), 1);
  });

  it("cast YES vote with quadratic calculation", async () => {
    const voter = Keypair.generate();
    const vote_type = 1; // YES vote
    const tokenAmount = 100;

    await connection.requestAirdrop(voter.publicKey, 100_000_000);
    await new Promise((res) => setTimeout(res, 3000));

    mint = await createMint(
      connection,
      creator,
      creator.publicKey,
      creator.publicKey,
      0
    );

    const voterTokenAccount = await createAccount(
      connection,
      voter,
      mint,
      voter.publicKey
    );

    await mintTo(
      connection,
      creator,
      mint,
      voterTokenAccount,
      creator,
      tokenAmount
    );

    const initialProposal = await program.account.proposal.fetch(proposalPda);
    const initialYesVotes = Number(initialProposal.yesVoteCount);
    const initialNoVotes = Number(initialProposal.noVoteCount);

    const [votePda] = await PublicKey.findProgramAddressSync(
      [
        Buffer.from('vote'),
        voter.publicKey.toBuffer(),
        proposalPda.toBuffer()
      ],
      program.programId
    );

    await program.methods
      .castVote(vote_type)
      .accountsPartial({
        voter: voter.publicKey,
        dao: daoPda,
        proposal: proposalPda,
        voteAccount: votePda,
        creatorTokenAccount: voterTokenAccount,
        systemProgram: SystemProgram.programId
      })
      .signers([voter])
      .rpc();

    const voteAccount = await program.account.vote.fetch(votePda);
    const expectedVoteCredits = Math.floor(Math.sqrt(tokenAmount));

    assert.ok(voteAccount.authority.equals(voter.publicKey));
    assert.strictEqual(voteAccount.voteType, vote_type);
    assert.strictEqual(Number(voteAccount.voteCredits), expectedVoteCredits);

    const updatedProposal = await program.account.proposal.fetch(proposalPda);
    assert.strictEqual(
      Number(updatedProposal.yesVoteCount),
      initialYesVotes + expectedVoteCredits,
      "YES vote count should increase by voting credits"
    );
    assert.strictEqual(
      Number(updatedProposal.noVoteCount),
      initialNoVotes,
      "NO vote count should remain unchanged"
    );
  });

  it("cast NO vote with different token amount", async () => {
    const voter2 = Keypair.generate();
    const vote_type = 0; // NO vote
    const tokenAmount = 25; // sqrt(25) = 5 credits

    await connection.requestAirdrop(voter2.publicKey, 100_000_000);
    await new Promise((res) => setTimeout(res, 3000));

    const voter2TokenAccount = await createAccount(
      connection,
      voter2,
      mint,
      voter2.publicKey
    );

    await mintTo(
      connection,
      creator,
      mint,
      voter2TokenAccount,
      creator,
      tokenAmount
    );

    const beforeProposal = await program.account.proposal.fetch(proposalPda);
    const beforeYesVotes = Number(beforeProposal.yesVoteCount);
    const beforeNoVotes = Number(beforeProposal.noVoteCount);

    const [vote2Pda] = await PublicKey.findProgramAddressSync(
      [
        Buffer.from('vote'),
        voter2.publicKey.toBuffer(),
        proposalPda.toBuffer()
      ],
      program.programId
    );

    await program.methods
      .castVote(vote_type)
      .accountsPartial({
        voter: voter2.publicKey,
        dao: daoPda,
        proposal: proposalPda,
        voteAccount: vote2Pda,
        creatorTokenAccount: voter2TokenAccount,
        systemProgram: SystemProgram.programId
      })
      .signers([voter2])
      .rpc();

    const vote2Account = await program.account.vote.fetch(vote2Pda);
    const expectedCredits2 = Math.floor(Math.sqrt(tokenAmount));

    assert.ok(vote2Account.authority.equals(voter2.publicKey));
    assert.strictEqual(vote2Account.voteType, vote_type);
    assert.strictEqual(Number(vote2Account.voteCredits), expectedCredits2);

    const finalProposal = await program.account.proposal.fetch(proposalPda);
    assert.strictEqual(
      Number(finalProposal.yesVoteCount),
      beforeYesVotes,
      "YES vote count should remain unchanged"
    );
    assert.strictEqual(
      Number(finalProposal.noVoteCount),
      beforeNoVotes + expectedCredits2,
      "NO vote count should increase by voting credits"
    );
  });

  it("should fail when voter tries to vote twice", async () => {
    const voter3 = Keypair.generate();
    await connection.requestAirdrop(voter3.publicKey, 100_000_000);
    await new Promise((res) => setTimeout(res, 3000));

    const voter3TokenAccount = await createAccount(
      connection,
      voter3,
      mint,
      voter3.publicKey
    );

    await mintTo(
      connection,
      creator,
      mint,
      voter3TokenAccount,
      creator,
      100  // No need to multiply by 10^9 with 0 decimals
    );

    const [vote3Pda] = await PublicKey.findProgramAddressSync(
      [
        Buffer.from('vote'),
        voter3.publicKey.toBuffer(),
        proposalPda.toBuffer()
      ],
      program.programId
    );

    await program.methods
      .castVote(1)
      .accountsPartial({
        voter: voter3.publicKey,
        dao: daoPda,
        proposal: proposalPda,
        voteAccount: vote3Pda,
        creatorTokenAccount: voter3TokenAccount,
        systemProgram: SystemProgram.programId
      })
      .signers([voter3])
      .rpc();

    try {
      await program.methods
        .castVote(0)
        .accountsPartial({
          voter: voter3.publicKey,
          dao: daoPda,
          proposal: proposalPda,
          voteAccount: vote3Pda,
          creatorTokenAccount: voter3TokenAccount,
          systemProgram: SystemProgram.programId
        })
        .signers([voter3])
        .rpc();

      assert.fail("Second vote should have failed");
    } catch (error) {
      assert.ok(error.message.includes("already in use"));
    }
  });
});


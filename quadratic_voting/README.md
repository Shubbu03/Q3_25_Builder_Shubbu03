# Quadratic Voting Program

A decentralized autonomous organization program built on Solana using the Anchor framework that implements quadratic voting mechanics to ensure democratic and proportional governance based on token holdings.

## 🎯 Overview

This program enables the creation of DAOs where voting power follows a quadratic function rather than linear token holdings. In quadratic voting, the voting power equals the square root of the number of tokens held, which reduces the influence of large token holders and promotes more democratic decision-making.

**Key Concept**: If you hold 100 tokens, your voting power is √100 = 10 votes, not 100 votes. This mechanism prevents plutocracy and encourages broader participation.

## ✨ Features

- **Quadratic Voting Mechanism**: Voting power = √(token_balance) for fair governance
- **DAO Creation**: Anyone can create a DAO with a unique name and identity
- **Proposal System**: Create proposals with metadata for community voting
- **Token-Based Governance**: Voting power derived from SPL token holdings
- **Immutable Vote Records**: Each vote is permanently recorded on-chain
- **Sybil Resistance**: One vote per voter per proposal prevents double voting
- **PDA-Based Security**: Uses Program Derived Addresses for secure account management

## 🏗️ Program Architecture

### Core Instructions

1. **`initialize_dao`**: Create a new DAO with specified name and authority
2. **`initialize_proposal`**: Create a new proposal within a DAO for voting
3. **`cast_vote`**: Submit a vote (YES/NO) on a proposal with quadratic calculation

### State Accounts

#### DAO Account
```rust
pub struct Dao {
    pub name: String,           // DAO name (max 32 chars)
    pub authority: Pubkey,      // DAO creator/admin
    pub proposal_count: u64,    // Number of proposals created
    pub bump: u8,              // PDA bump seed
}
```

#### Proposal Account
```rust
pub struct Proposal {
    pub authority: Pubkey,      // Proposal creator
    pub metadata: String,       // Proposal description (max 50 chars)
    pub yes_vote_count: u64,   // Total YES votes (quadratic credits)
    pub no_vote_count: u64,    // Total NO votes (quadratic credits)
    pub bump: u8,              // PDA bump seed
}
```

#### Vote Account
```rust
pub struct Vote {
    pub authority: Pubkey,      // Voter's public key
    pub vote_type: u8,         // 0 = NO, 1 = YES
    pub vote_credits: u64,     // Calculated quadratic voting credits
    pub bump: u8,              // PDA bump seed
}
```

## ⚙️ Setup

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd quadratic_voting
   yarn install
   ```

2. **Configure Solana for local development:**
   ```bash
   solana config set --url localhost
   solana-keygen new --outfile ~/.config/solana/id.json
   ```

3. **Start local Solana validator:**
   ```bash
   solana-test-validator
   ```

4. **Build and deploy the program:**
   ```bash
   anchor build
   anchor deploy
   ```

5. **Run tests:**
   ```bash
   anchor test
   ```

## 🚀 Usage Examples

### 1. Initialize a DAO

```typescript
import * as anchor from "@coral-xyz/anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js";

const creator = anchor.web3.Keypair.generate();
const daoName = "MyDAO";

// Derive DAO PDA
const [daoPda] = await PublicKey.findProgramAddressSync(
  [
    Buffer.from("dao"),
    creator.publicKey.toBuffer(),
    Buffer.from(daoName)
  ],
  program.programId
);

// Initialize DAO
await program.methods
  .initializeDao(daoName)
  .accountsPartial({
    creator: creator.publicKey,
    dao: daoPda,
    systemProgram: SystemProgram.programId
  })
  .signers([creator])
  .rpc();
```

### 2. Create a Proposal

```typescript
const proposalMetadata = "Should we increase treasury allocation?";

// Get current DAO state
const daoAccount = await program.account.dao.fetch(daoPda);

// Derive proposal PDA
const [proposalPda] = await PublicKey.findProgramAddressSync(
  [
    Buffer.from("proposal"),
    daoPda.toBuffer(),
    daoAccount.proposalCount.toArrayLike(Buffer, "le", 8)
  ],
  program.programId
);

// Create proposal
await program.methods
  .initializeProposal(proposalMetadata)
  .accountsPartial({
    creator: creator.publicKey,
    dao: daoPda,
    proposal: proposalPda,
    systemProgram: SystemProgram.programId
  })
  .signers([creator])
  .rpc();
```

### 3. Cast a Vote

```typescript
import { createMint, createAccount, mintTo } from "@solana/spl-token";

// Setup voter with tokens
const voter = anchor.web3.Keypair.generate();
const tokenAmount = 100; // Will result in √100 = 10 voting credits

// Create and fund token account
const mint = await createMint(connection, creator, creator.publicKey, null, 0);
const voterTokenAccount = await createAccount(
  connection,
  voter,
  mint,
  voter.publicKey
);

await mintTo(connection, creator, mint, voterTokenAccount, creator, tokenAmount);

// Derive vote PDA
const [votePda] = await PublicKey.findProgramAddressSync(
  [
    Buffer.from("vote"),
    voter.publicKey.toBuffer(),
    proposalPda.toBuffer()
  ],
  program.programId
);

// Cast YES vote (vote_type = 1)
await program.methods
  .castVote(1)
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
```

## 🧮 Quadratic Voting Mathematics

The quadratic voting mechanism works as follows:

- **Token Balance**: 1 → **Voting Credits**: 1
- **Token Balance**: 4 → **Voting Credits**: 2
- **Token Balance**: 9 → **Voting Credits**: 3
- **Token Balance**: 100 → **Voting Credits**: 10
- **Token Balance**: 10,000 → **Voting Credits**: 100

```rust
// Quadratic voting calculation in the program
let voting_credits = (token_account.amount as f64).sqrt() as u64;
```

This ensures that doubling your token holdings doesn't double your voting power, promoting more equitable governance.

## 🧪 Testing

The test suite demonstrates the complete quadratic voting workflow:

```bash
# Run all tests
anchor test

# Run specific test
anchor test -- --grep "quadratic calculation"
```

## 🛠️ Development

### Project Structure

```
quadratic_voting/
├── Anchor.toml           # Anchor configuration
├── Cargo.toml           # Rust workspace configuration
├── package.json         # Node.js dependencies and scripts
├── programs/            # Solana programs
│   └── quadratic_voting/
│       ├── src/
│       │   ├── lib.rs          # Main program entry point
│       │   ├── constants.rs    # Program constants
│       │   ├── error.rs        # Custom error definitions
│       │   ├── instructions/   # Instruction handlers
│       │   │   ├── mod.rs
│       │   │   ├── initialize_dao.rs
│       │   │   ├── initialize_proposal.rs
│       │   │   └── cast_vote.rs
│       │   └── state/          # Account state definitions
│       │       ├── mod.rs
│       │       ├── dao.rs
│       │       ├── proposal.rs
│       │       └── vote.rs
│       └── Cargo.toml
├── tests/               # TypeScript test files
│   └── quadratic_voting.ts
├── migrations/          # Deployment scripts
└── target/             # Build output (generated)
```

### Development Workflow

1. **Make changes** to Rust code in `programs/quadratic_voting/src/`
2. **Build** with `anchor build`
3. **Test** with `anchor test`
4. **Format** TypeScript with `yarn lint:fix`
5. **Deploy** with `anchor deploy`

## 🤝 Contributing

### Development Setup

1. **Fork and Clone**
   ```bash
   git fork <repository-url>
   git clone <your-fork-url>
   cd quadratic_voting
   ```

2. **Environment Setup**
   ```bash
   # Install Rust
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   
   # Install Solana CLI
   sh -c "$(curl -sSfL https://release.solana.com/v1.18.0/install)"
   
   # Install Anchor
   cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
   avm install latest
   avm use latest
   ```

3. **Development Workflow**
   ```bash
   # Create feature branch
   git checkout -b feature/your-feature
   
   # Make changes and test
   anchor test
   
   # Lint code
   yarn lint:fix
   
   # Commit and push
   git commit -m "feat: add your feature"
   git push origin feature/your-feature
   ```


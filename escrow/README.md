# Solana Escrow Smart Contract

A secure, decentralized escrow smart contract built on Solana using the Anchor framework. This program enables trustless token swaps between two parties by holding tokens in escrow until both parties fulfill their obligations.

## 🎯 Overview

This escrow contract facilitates peer-to-peer token exchanges on the Solana blockchain. The maker deposits tokens into an escrow account, specifying what tokens they want in return. A taker can then fulfill the trade by providing the requested tokens, which automatically releases the escrowed tokens to the taker and sends the requested tokens to the maker.

## ✨ Features

- **Trustless Token Swaps**: No intermediary required - smart contract handles the exchange
- **SPL Token Support**: Works with any SPL token including Token-2022 standard
- **Refund Mechanism**: Makers can reclaim their tokens if no one takes the offer
- **Secure PDA-based Vaults**: Uses Program Derived Addresses for secure token storage
- **Atomic Operations**: All transfers happen atomically - either the full trade succeeds or fails
- **Associated Token Account Management**: Automatically handles ATA creation when needed

## 📁 Project Structure

```
escrow/
├── programs/escrow/          # Rust smart contract code
│   ├── src/
│   │   ├── instructions/     # Program instructions
│   │   │   ├── initialize.rs # Basic initialization
│   │   │   ├── make.rs       # Create escrow offer
│   │   │   ├── take.rs       # Accept escrow offer
│   │   │   └── refund.rs     # Cancel escrow and refund
│   │   ├── state/           # Account structures
│   │   │   └── escrow.rs    # Escrow account definition
│   │   ├── error.rs         # Custom error types
│   │   ├── constants.rs     # Program constants
│   │   └── lib.rs          # Main program entry point
│   └── Cargo.toml          # Rust dependencies
├── tests/                   # TypeScript test files
├── migrations/              # Deployment scripts
├── app/                     # Frontend application (if any)
├── Anchor.toml             # Anchor configuration
└── package.json            # Node.js dependencies
```

## 🔧 How It Works

### 1. Make Escrow
- Maker creates an escrow offer by depositing Token A
- Specifies the amount of Token B they want in return
- Tokens are held in a secure vault controlled by the program
- A unique escrow account is created using a seed

### 2. Take Escrow
- Taker finds an attractive escrow offer
- Deposits the requested Token B amount
- Automatically receives the escrowed Token A
- Maker receives the Token B payment
- Escrow account is closed

### 3. Refund Escrow
- Maker can cancel their offer at any time
- Retrieves their deposited Token A
- Escrow account is closed and rent is returned

## 🏗️ Program Instructions

### `make`
Creates a new escrow offer.
- **Parameters**: `seed: u64`, `deposit: u64`, `receive: u64`
- **Accounts**: Maker, mint accounts, token accounts, escrow PDA, vault
- **Action**: Deposits tokens into escrow vault

### `take`
Accepts an existing escrow offer.
- **Accounts**: Taker, maker, mint accounts, token accounts, escrow, vault
- **Action**: Exchanges tokens and closes escrow

### `refund`
Cancels escrow and returns tokens to maker.
- **Accounts**: Maker, mint account, token accounts, escrow, vault
- **Action**: Returns deposited tokens and closes escrow

### `initialize`
Basic program initialization (mainly for testing).

## 🚀 Installation & Setup

### Prerequisites
- [Rust](https://rustup.rs/) (latest stable)
- [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools) (v1.18+)
- [Anchor CLI](https://anchor-lang.com/docs/installation) (v0.31+)
- [Node.js](https://nodejs.org/) (v18+)
- [Yarn](https://yarnpkg.com/)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd escrow
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Build the program**
   ```bash
   anchor build
   ```

4. **Configure Solana CLI**
   ```bash
   solana config set --url localhost
   solana-test-validator  # Run in separate terminal
   ```

5. **Deploy the program**
   ```bash
   anchor deploy
   ```

## 🧪 Testing

Run the test suite:
```bash
anchor test
```

The tests demonstrate:
- Creating escrow offers
- Taking escrow offers
- Refunding escrows
- Error handling scenarios

## 🔧 Usage Example

```typescript
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Escrow } from "../target/types/escrow";

// Initialize program
const program = anchor.workspace.escrow as Program<Escrow>;

// Create escrow
await program.methods
  .make(
    new anchor.BN(123456),  // seed
    new anchor.BN(1000000), // deposit amount
    new anchor.BN(2000000)  // receive amount
  )
  .accounts({
    maker: makerKeypair.publicKey,
    mintA: tokenMintA,
    mintB: tokenMintB,
    // ... other required accounts
  })
  .signers([makerKeypair])
  .rpc();

// Take escrow
await program.methods
  .take()
  .accounts({
    taker: takerKeypair.publicKey,
    maker: makerKeypair.publicKey,
    // ... other required accounts
  })
  .signers([takerKeypair])
  .rpc();
```

## 🔒 Security Features

- **PDA-based Security**: Escrow vaults use Program Derived Addresses for secure access control
- **Atomic Operations**: All token transfers are atomic - no partial states
- **Account Validation**: Strict account validation prevents unauthorized access
- **Bump Seed Verification**: Uses canonical bump seeds for deterministic PDAs
- **Token Program Integration**: Leverages battle-tested SPL Token program

## 📋 Account Schema

### Escrow Account
```rust
pub struct Escrow {
    pub seed: u64,        // Unique identifier
    pub maker: Pubkey,    // Escrow creator
    pub mint_a: Pubkey,   // Token being offered
    pub mint_b: Pubkey,   // Token being requested
    pub receive: u64,     // Amount requested
    pub bump: u8,         // PDA bump seed
}
```

## 🛠️ Development

### Available Scripts
- `yarn lint`: Check code formatting
- `yarn lint:fix`: Fix code formatting
- `anchor build`: Compile the program
- `anchor test`: Run tests
- `anchor deploy`: Deploy to configured cluster

### Program ID
The program is deployed with ID: `BBaNgA72VVNmchrAc3Jgcfq6P5tCTFtUYbGVbn8YUdZR`

## 📖 Documentation

For more detailed information:
- [Anchor Documentation](https://anchor-lang.com/)
- [Solana Documentation](https://docs.solana.com/)
- [SPL Token Documentation](https://spl.solana.com/token)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request


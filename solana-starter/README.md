# Solana Starter

A comprehensive Solana development starter project providing examples and implementations for core Solana functionality, built for the Web3 Builders Alliance (WBA) program.

## Project Structure

```
solana-starter/
├── rs/               # Rust programs and utilities
│   ├── src/
│   │   ├── programs/ # Solana program definitions
│   │   ├── prereqs.rs
│   │   └── cluster1.rs
└── ts/               # TypeScript client implementations
    ├── prereqs/      # Basic Solana operations
    ├── cluster1/     # Advanced features (SPL, NFTs, Vaults)
    ├── programs/     # Program interfaces
    └── tools/        # Utility scripts
```

## Features

### 🏗️ Prerequisites (`ts/prereqs/`)
- **Wallet Generation**: Create new Solana keypairs
- **Airdrops**: Request devnet SOL for testing
- **Transfers**: Send SOL between accounts
- **Enrollment**: Register with WBA prerequisite program

### 🪙 SPL Tokens (`ts/cluster1/`)
- **Token Creation**: Initialize new SPL tokens
- **Minting**: Create token supplies
- **Transfers**: Send tokens between accounts
- **Metadata**: Add rich metadata to tokens

### 🖼️ NFTs
- **Image Upload**: Store NFT images on Irys/Arweave
- **Metadata Creation**: Generate NFT metadata
- **Minting**: Create unique NFTs using Metaplex

### 🏦 Vault System
A complete vault program supporting:
- **SOL Deposits/Withdrawals**: Secure SOL storage
- **SPL Token Operations**: Token vault management
- **NFT Storage**: Secure NFT custody
- **Vault Closure**: Clean shutdown with fund recovery

### 🛠️ Utilities (`ts/tools/`)
- **Wallet Converters**: Convert between wallet formats (JSON ↔ Base58)
- **Airdrop Tools**: Automated devnet funding

## Quick Start

### Prerequisites
- Node.js 16+
- Rust & Cargo
- Solana CLI tools

### Installation

```bash
# Install TypeScript dependencies
cd ts
npm install

# Install Rust dependencies
cd ../rs
cargo build
```

### Basic Usage

```bash
# Generate a new wallet
npm run keygen

# Request devnet SOL
npm run airdrop

# Enroll in WBA program
npm run enroll

# Create and mint SPL token
npm run spl_init
npm run spl_mint

# Create and mint NFT
npm run nft_image
npm run nft_metadata
npm run nft_mint

# Vault operations
npm run vault_init
npm run vault_deposit
npm run vault_withdraw
```

## Tech Stack

- **Blockchain**: Solana (Devnet)
- **Frontend**: TypeScript, Solana Web3.js
- **Programs**: Rust, Anchor Framework
- **NFTs**: Metaplex Token Metadata
- **Storage**: Irys/Arweave for NFT assets

## Development

This project provides ready-to-run examples for:
- Solana program interaction
- Wallet management
- Token operations
- NFT lifecycle
- Vault/escrow patterns

Each script in the `ts/` directory can be run independently and includes comprehensive error handling and transaction logging.

## Learning Path

1. **Start with Prerequisites**: Master basic Solana operations
2. **Explore SPL Tokens**: Understand token creation and management
3. **Create NFTs**: Learn metadata standards and minting
4. **Build with Vaults**: Implement secure fund management

## Network

All examples target Solana **Devnet** for safe testing and development.

---

*Part of the Web3 Builders Alliance educational program*
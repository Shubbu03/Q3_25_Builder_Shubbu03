# Turbin3 Prerequisite Project

A TypeScript-based Solana blockchain development project that demonstrates fundamental Web3 operations and serves as a prerequisite for the Turbin3 Web3 development bootcamp.

## 🎯 Project Overview

This project implements core Solana blockchain operations including:
- Wallet generation and management
- SOL token airdrops from devnet faucet
- Token transfers with precise fee calculation
- Smart contract interaction through Anchor framework
- NFT minting as proof of completion

## 🏗️ Architecture

The project consists of several TypeScript modules that interact with Solana's devnet:

- **`keygen.ts`** - Generates new Solana wallet keypairs
- **`airdrop.ts`** - Requests SOL tokens from devnet faucet
- **`transfer.ts`** - Transfers SOL to Turbin3 address with fee optimization
- **`enroll.ts`** - Interacts with Turbin3 program to submit completion proof
- **`programs/Turbin3_prereq.ts`** - Contains the IDL for the Turbin3 prerequisite program

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Yarn package manager
- A Solana wallet (will be generated if you don't have one)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd prereq-1
```

2. Install dependencies:
```bash
yarn install
```

### Required Wallet Files

You'll need two wallet files in your project root:
- `dev-wallet.json` - Your development wallet (generated from keygen.ts)
- `Turbin3-wallet.json` - Your submission wallet for the program

## 📋 Usage Guide

### 1. Generate a Wallet

Create a new Solana wallet keypair:

```bash
yarn keygen
```

This will output:
- Your public key (wallet address)
- Your private key array (save this as `dev-wallet.json`)

### 2. Request Devnet SOL

Fund your wallet with devnet SOL tokens:

```bash
yarn airdrop
```

This requests 2 SOL from the devnet faucet. You can view the transaction on [Solana Explorer](https://explorer.solana.com/?cluster=devnet).

### 3. Transfer SOL

Transfer SOL to the Turbin3 address:

```bash
yarn transfer
```

The script automatically:
- Calculates the exact transaction fee
- Transfers your entire balance minus fees
- Sends to the Turbin3 public key: `87eaezi5Nou5d5MFH2DStENzWZ6iHNroDHZSbSca4RDu`

### 4. Complete Enrollment

Submit your TypeScript prerequisite completion:

```bash
yarn enroll
```

This interacts with the Turbin3 program to:
- Submit your TypeScript completion proof
- Mint an NFT as verification
- Register your GitHub handle in the program

## 🔧 Technical Details

### Solana Program Integration

The project interacts with the Turbin3 prerequisite program:
- **Program ID**: `TRBZyQHB3m68FGeVsqTK39Wm4xejadjVhP5MAZaKWDM`
- **Network**: Solana Devnet
- **Framework**: Anchor

### Key Features

1. **Precise Fee Calculation**: The transfer script calculates exact transaction fees to transfer the maximum possible amount.

2. **Program Derived Addresses**: Uses PDAs for deterministic account creation based on user public key.

3. **NFT Minting**: Integrates with Metaplex Core program to mint completion certificates.

4. **Error Handling**: Comprehensive error handling for common blockchain operation failures.

### Program Instructions

The Turbin3 program supports:
- `initialize` - Register with GitHub handle
- `submitTs` - Submit TypeScript completion (this project)
- `submit_rs` - Submit Rust completion
- `update` - Update GitHub handle
- `close` - Close account and reclaim rent

## 📁 Project Structure

```
prereq-1/
├── keygen.ts              # Wallet generation utility
├── airdrop.ts             # Devnet SOL faucet interaction
├── transfer.ts            # SOL transfer with fee calculation
├── enroll.ts              # Program enrollment and submission
├── programs/
│   └── Turbin3_prereq.ts  # Program IDL definitions
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── README.md              # This file
```

## 🛠️ Development

### Built With

- **TypeScript** - Primary development language
- **Solana Web3.js** - Blockchain interaction library
- **Anchor Framework** - Solana program development framework
- **Metaplex Core** - NFT standard implementation

### Key Dependencies

```json
{
  "@coral-xyz/anchor": "^0.31.1",
  "@solana/web3.js": "^1.98.2",
  "bs58": "^6.0.0",
  "prompt-sync": "^4.2.0"
}
```

## 🔍 Troubleshooting

### Common Issues

1. **Insufficient SOL for fees**: Run the airdrop script again
2. **Network timeouts**: Solana devnet can be slow; retry operations
3. **Account already exists**: You may have already completed enrollment
4. **Invalid wallet files**: Ensure wallet JSON files are properly formatted

### Error Codes

- `6000` - TypeScript submission not completed
- `6001` - TypeScript submission already completed  
- `6002` - Rust submission already completed
- `6003` - Submission not allowed (timing restriction)

## 🔗 Resources

- [Solana Documentation](https://docs.solana.com/)
- [Anchor Framework](https://www.anchor-lang.com/)
- [Solana Explorer (Devnet)](https://explorer.solana.com/?cluster=devnet)
- [Turbin3 Program](https://explorer.solana.com/address/TRBZyQHB3m68FGeVsqTK39Wm4xejadjVhP5MAZaKWDM?cluster=devnet)

## 📜 License

MIT License - see LICENSE file for details.

---

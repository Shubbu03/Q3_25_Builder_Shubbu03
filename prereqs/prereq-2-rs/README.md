# Prereq-2: Solana Development Prerequisites

A comprehensive Rust library demonstrating essential Solana blockchain operations and wallet management. This project serves as a hands-on learning tool for Solana development fundamentals, covering everything from keypair generation to smart contract interactions.

## 🎯 Overview

This project is part of the Turbin3 Solana development course prerequisites. It provides practical examples of core Solana operations including wallet management, token transfers, airdrops, and interaction with Solana programs through a series of test functions.

## 🚀 Features

### 🔐 Wallet Management
- **Keypair Generation**: Create new Solana wallets programmatically
- **Key Format Conversion**: Convert between Base58 and JSON wallet formats
- **Signature Verification**: Cryptographic signature creation and verification

### 💰 Token Operations
- **Devnet Airdrop**: Request SOL tokens from Solana devnet
- **SOL Transfers**: Send SOL between wallet addresses
- **Complete Wallet Drainage**: Transfer entire wallet balance (accounting for fees)

### 🎨 NFT & Program Interaction
- **Turbin3 Program Integration**: Interact with the Turbin3 prerequisite program
- **NFT Minting**: Mint NFTs through the MPL Core program
- **PDA Management**: Work with Program Derived Addresses

## 📋 Prerequisites

- **Rust**: Latest stable version
- **Solana CLI**: For wallet file management
- **Devnet Access**: Internet connection for Solana devnet interaction

## 🛠️ Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd prereq-2
   ```

2. **Install dependencies**:
   ```bash
   cargo build
   ```

3. **Setup wallet files** (required for most operations):
   - `dev-wallet.json`: Your development wallet
   - `original-wallet.json`: Original wallet for program submissions

## 📚 Available Functions

### 1. Keypair Generation (`keygen`)
Generates a new Solana keypair and displays the public key and private key in JSON format.

```bash
cargo test keygen -- --nocapture
```

### 2. Base58 to Wallet Conversion (`base58_to_wallet`)
Converts a Base58-encoded private key to wallet JSON format.

```bash
cargo test base58_to_wallet -- --nocapture
```

### 3. Wallet to Base58 Conversion (`wallet_to_base58`)
Converts a JSON wallet format to Base58-encoded private key.

```bash
cargo test wallet_to_base58 -- --nocapture
```

### 4. Devnet Airdrop (`airdrop`)
Requests 1 SOL from the Solana devnet faucet.

```bash
cargo test airdrop -- --nocapture
```

### 5. SOL Transfer (`transfer_sol`)
Demonstrates signature verification and transfers 1,000,000 lamports (0.001 SOL).

```bash
cargo test transfer_sol -- --nocapture
```

### 6. Empty Wallet (`empty_wallet`)
Transfers the entire wallet balance to another address, accounting for transaction fees.

```bash
cargo test empty_wallet -- --nocapture
```

### 7. Program Submission (`submit`)
Interacts with the Turbin3 prerequisite program to mint an NFT as part of course completion.

```bash
cargo test submit -- --nocapture
```

## 🔧 Configuration

### RPC Endpoint
The project uses a custom Turbin3 devnet RPC endpoint:
```rust
const RPC_URL: &str = "https://turbine-solanad-4cde.devnet.rpcpool.com/9a9da9cf-6db1-47dc-839a-55aca5c9c80a";
```

### Target Address
Most transfer operations use the following recipient address:
```rust
let to_pubkey = Pubkey::from_str("AdkKhs45BQjtJxE3Pn99H1D7SkTEKfQpgp9RmQxUX5JE").unwrap();
```

### Program Addresses
- **Turbin3 Prereq Program**: `TRBZyQHB3m68FGeVsqTK39Wm4xejadjVhP5MAZaKWDM`
- **Collection**: `5ebsp5RChCGK7ssRZMVMufgVZhd2kFbNaotcZ5UvytN2`
- **MPL Core Program**: `CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d`

## 📦 Dependencies

```toml
[dependencies]
solana-sdk = "1.15.2"      # Core Solana SDK
bs58 = "0.4"               # Base58 encoding/decoding
solana-client = "1.15.2"   # RPC client for Solana
solana-program = "1.15.2"  # Solana program utilities
```

## 🧪 Testing

Run all tests:
```bash
cargo test
```

Run specific test with output:
```bash
cargo test <function_name> -- --nocapture
```

Run tests that require user input in sequence:
```bash
cargo test keygen -- --nocapture
cargo test base58_to_wallet -- --nocapture
cargo test wallet_to_base58 -- --nocapture
```


## 🎓 Learning Objectives

This project teaches:

1. **Solana Fundamentals**:
   - Keypair generation and management
   - Transaction creation and signing
   - RPC client usage

2. **Cryptography Concepts**:
   - Public/private key cryptography
   - Digital signatures
   - Base58 encoding

3. **Blockchain Operations**:
   - Balance checking
   - Token transfers
   - Fee calculation
   - Block hash handling

4. **Program Interaction**:
   - Account metadata creation
   - Instruction building
   - Program Derived Addresses (PDAs)
   - Cross-program invocations

## 🔗 Useful Links

- [Solana Documentation](https://docs.solana.com/)
- [Solana Devnet Explorer](https://explorer.solana.com/?cluster=devnet)
- [Solana Cookbook](https://solanacookbook.com/)
- [Turbin3 Course](https://turbin3.com/)

## 📄 License

This project is part of educational coursework. Please respect the original course materials and guidelines.

## 🤝 Contributing

This is an educational project. For improvements or bug fixes, please ensure changes align with the learning objectives and maintain compatibility with the Turbin3 course requirements.

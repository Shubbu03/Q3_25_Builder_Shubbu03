# NFT Marketplace Program

A Solana-based NFT marketplace built with Anchor framework that allows users to list, purchase, and trade verified collection NFTs with configurable marketplace fees.

## Features

- **NFT Collection Trading**: List and purchase NFTs from verified collections with metadata validation
- **Fee Structure**: Configurable marketplace fees with basis points system (max 10%)
- **Treasury System**: Automatic fee distribution to marketplace treasury
- **Reward Token System**: Custom SPL token minting integrated with marketplace
- **Secure Listings**: NFTs are held in secure vault accounts during listing period
- **Collection Verification**: Ensures only verified collection NFTs can be traded
- **PDA Management**: Proper program-derived address handling for all accounts

## Program Architecture

### Core Instructions
- `initialize`: Setup marketplace with name, fee structure, and treasury (admin only)
- `listing`: List an NFT for sale with price validation and collection verification
- `delisting`: Remove NFT from marketplace and return to owner
- `purchase`: Buy listed NFT with automatic fee distribution

### State Accounts
- **Marketplace**: Global configuration (admin, fee, name, treasury, rewards mint)
- **Listing**: Individual NFT listing data (maker, mint, price, bump)

## Quick Start

### Prerequisites
- Node.js 16+
- Rust 1.70+
- Solana CLI 1.16+
- Anchor CLI 0.29+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd marketplace

# Install dependencies
yarn install

# Build the program
anchor build

# Deploy to localnet
anchor deploy
```

### Testing

```bash
# Start local validator
solana-test-validator

# Run tests
anchor test
```

## Usage

### 1. Initialize Marketplace (Admin)
```typescript
await program.methods
  .initialize(marketplaceName, feeInBasisPoints)
  .accounts({
    admin: adminKeypair.publicKey,
    // ... other accounts
  })
  .rpc();
```

### 2. List NFT for Sale
```typescript
await program.methods
  .listing(priceInLamports)
  .accounts({
    maker: sellerKeypair.publicKey,
    makerMint: nftMint,
    collectionMint: collectionMint,
    // ... other accounts
  })
  .rpc();
```

### 3. Purchase NFT
```typescript
await program.methods
  .purchase()
  .accounts({
    taker: buyerKeypair.publicKey,
    maker: sellerPublicKey,
    makerMint: nftMint,
    // ... other accounts
  })
  .rpc();
```

### 4. Delist NFT
```typescript
await program.methods
  .delisting()
  .accounts({
    maker: sellerKeypair.publicKey,
    makerMint: nftMint,
    // ... other accounts
  })
  .rpc();
```

## Configuration

Key parameters in `Marketplace`:
- `fee`: Marketplace fee in basis points (max 1000 = 10%)
- `name`: Marketplace identifier (max 32 characters)
- `admin`: Marketplace administrator authority

## Security Considerations

- NFT collection verification through metadata
- Proper vault system for holding NFTs during listing
- Fee validation and overflow protection
- Owner-only delisting restrictions
- PDA seed validation for all accounts
- Admin-only marketplace initialization

## Project Structure

```
programs/marketplace/src/
├── lib.rs              # Program entry point
├── error.rs            # Custom error definitions
├── instructions/       # Instruction handlers
│   ├── initialize.rs   # Marketplace setup
│   ├── list.rs         # NFT listing
│   ├── delist.rs       # NFT delisting
│   └── purchase.rs     # NFT purchase
└── state/              # Account state definitions
    ├── marketplace.rs  # Global marketplace config
    └── listing.rs      # Individual listing data
```

## Contributing

### Development Setup

1. **Fork and Clone**
   ```bash
   git fork <repository-url>
   git clone <your-fork-url>
   cd marketplace
   ```

2. **Environment Setup**
   ```bash
   # Install Rust
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   
   # Install Solana CLI
   sh -c "$(curl -sSfL https://release.solana.com/v1.16.0/install)"
   
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

### Code Standards

- **Rust**: Follow standard Rust conventions with `cargo fmt`
- **TypeScript**: Use Prettier for formatting (`yarn lint:fix`)
- **Comments**: Document complex logic and security considerations
- **Testing**: Add tests for new instructions and edge cases
- **Security**: Always validate inputs and check account ownership

### Pull Request Process

1. Ensure all tests pass and code is formatted
2. Add tests for new functionality
3. Update documentation if needed
4. Create detailed PR description explaining changes
5. Wait for code review and address feedback

### Common Gotchas

- **PDA Seeds**: Always use consistent seed derivation
- **Account Validation**: Verify all account constraints in instructions
- **Fee Calculations**: Handle basis points and overflow carefully
- **Token Operations**: Check token account authority and balances
- **Metadata Verification**: Ensure collection signatures are valid
- **Vault Management**: Properly handle NFT transfers and account closure

---

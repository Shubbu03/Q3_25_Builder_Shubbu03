# NFT Staking Program

A Solana-based NFT staking platform built with Anchor framework that allows users to stake verified collection NFTs to earn reward tokens.

## Features

- **NFT Collection Staking**: Stake NFTs from verified collections with metadata validation
- **Time-based Rewards**: Earn points based on staking duration (configurable points per day)
- **Freeze Mechanism**: NFTs are frozen during staking period to prevent transfers
- **Reward Token System**: Custom SPL token minting for reward distribution
- **Configurable Parameters**: Admin-controlled staking limits and reward rates
- **Security**: Collection verification, delegation controls, and proper PDA management

## Program Architecture

### Core Instructions
- `initialise_config`: Setup global staking parameters (admin only)
- `initialise_user`: Create user staking account
- `stake`: Stake an NFT from verified collection
- `unstake`: Unstake NFT after freeze period expires
- `claim_rewards`: Mint reward tokens based on accumulated points

### State Accounts
- **StakeConfig**: Global configuration (points per stake, max stake limit, freeze period)
- **UserAccount**: User-specific data (accumulated points, staked count)
- **StakeAccount**: Individual NFT stake tracking (owner, mint, timestamp)

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
cd staking

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

### 1. Initialize Configuration (Admin)
```typescript
await program.methods
  .initialiseConfig(pointsPerStake, maxStake, freezePeriod)
  .accounts({
    admin: adminKeypair.publicKey,
    // ... other accounts
  })
  .rpc();
```

### 2. Create User Account
```typescript
await program.methods
  .initialiseUser()
  .accounts({
    user: userKeypair.publicKey,
    // ... other accounts
  })
  .rpc();
```

### 3. Stake NFT
```typescript
await program.methods
  .stake()
  .accounts({
    user: userKeypair.publicKey,
    mint: nftMint,
    collectionMint: collectionMint,
    // ... other accounts
  })
  .rpc();
```

### 4. Unstake NFT
```typescript
await program.methods
  .unstake()
  .accounts({
    user: userKeypair.publicKey,
    mint: nftMint,
    // ... other accounts
  })
  .rpc();
```

### 5. Claim Rewards
```typescript
await program.methods
  .claimRewards()
  .accounts({
    user: userKeypair.publicKey,
    // ... other accounts
  })
  .rpc();
```

## Configuration

Key parameters in `StakeConfig`:
- `points_per_stake`: Points earned per day of staking
- `max_stake`: Maximum NFTs a user can stake simultaneously
- `freeze_period`: Minimum staking duration (in days)

## Security Considerations

- NFT collection verification through metadata
- Proper delegation and freezing mechanisms
- Time-based unstaking restrictions
- PDA seed validation for all accounts
- Admin-only configuration updates

## Project Structure

```
programs/staking/src/
├── lib.rs              # Program entry point
├── error.rs            # Custom error definitions
├── instructions/       # Instruction handlers
│   ├── initialise_config.rs
│   ├── initialise_user.rs
│   ├── stake.rs
│   ├── unstake.rs
│   └── claim_rewards.rs
└── state/              # Account state definitions
    ├── stake_config.rs
    ├── user_account.rs
    └── stake_account.rs
```

## Contributing

### Development Setup

1. **Fork and Clone**
   ```bash
   git fork <repository-url>
   git clone <your-fork-url>
   cd staking
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
- **Time Calculations**: Handle Unix timestamp conversions carefully
- **Token Operations**: Check token account authority and balances
- **Metadata Verification**: Ensure collection signatures are valid

---

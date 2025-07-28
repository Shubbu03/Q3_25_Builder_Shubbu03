# Dice Betting Program

A provably fair dice betting game built on Solana using the Anchor framework. Players can place bets on dice rolls with transparent randomness generation using Ed25519 signatures.

## Features

- **Provably Fair Betting**: Uses Ed25519 signatures for verifiable randomness generation
- **Flexible Betting Range**: Support for roll predictions from 2-96
- **House Edge System**: Built-in 1.5% house edge for sustainable operation
- **Timeout Protection**: Automatic refund mechanism for unresolved bets
- **Minimum/Maximum Limits**: Configurable betting limits (minimum 0.01 SOL)
- **PDA Security**: Proper seed validation and account constraints

## How It Works

1. **House Setup**: House initializes vault with operating funds
2. **Place Bet**: Players bet on dice outcome (2-96) with custom seed
3. **Resolve Bet**: House provides Ed25519 signature for randomness
4. **Payout**: Automatic payout calculation with house edge applied
5. **Refund**: Timeout mechanism protects against stuck bets

### Randomness Generation
The program uses Ed25519 signatures to generate provably fair randomness:
- House provides signature for each bet resolution
- Hash of signature determines dice roll (1-100)
- Players can verify randomness independently

## Program Architecture

### Core Instructions
- `initialize`: Setup house vault with initial funds
- `place_bet`: Create new bet with seed, roll prediction, and amount
- `resolve_bet`: Resolve bet using Ed25519 signature for randomness
- `refund_bet`: Refund bet when timeout period expires

### State Accounts
- **Bet**: Individual bet tracking (player, seed, amount, slot, roll, bump)

## Quick Start

### Prerequisites
- Node.js 16+
- Rust 1.70+
- Solana CLI 1.16+
- Anchor CLI 0.29+

### Installation

```bash
# Clone the repository
cd dice

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

### 1. Initialize House Vault
```typescript
await program.methods
  .initialize(new anchor.BN(1000000000)) // 1 SOL
  .accounts({
    house: houseKeypair.publicKey,
    // ... other accounts
  })
  .rpc();
```

### 2. Place Bet
```typescript
const seed = new anchor.BN(Math.floor(Math.random() * 1000000));
const roll = 50; // Predict roll <= 50
const amount = new anchor.BN(10000000); // 0.01 SOL

await program.methods
  .placeBet(seed, roll, amount)
  .accounts({
    player: playerKeypair.publicKey,
    house: houseKeypair.publicKey,
    // ... other accounts
  })
  .rpc();
```

### 3. Resolve Bet
```typescript
const signature = [...]; // Ed25519 signature bytes

await program.methods
  .resolveBet(signature)
  .accounts({
    house: houseKeypair.publicKey,
    player: playerKeypair.publicKey,
    // ... other accounts
  })
  .rpc();
```

### 4. Refund Bet (if needed)
```typescript
await program.methods
  .refundBet()
  .accounts({
    player: playerKeypair.publicKey,
    // ... other accounts
  })
  .rpc();
```

## Configuration

### Betting Limits
- **Minimum Bet**: 0.01 SOL
- **Roll Range**: 2-96 (higher rolls = lower payout odds)
- **House Edge**: 1.5%

### Payout Calculation
```
Payout = (Bet Amount × (100 - House Edge %)) ÷ (Roll - 1) ÷ 100
```

## Security Considerations

- Ed25519 signature verification for randomness
- PDA seed validation for all accounts
- Proper account ownership checks
- Timeout mechanisms for bet resolution
- Minimum/maximum bet validations

## Project Structure

```
programs/dice/src/
├── lib.rs              # Program entry point
├── error.rs            # Custom error definitions
├── instructions/       # Instruction handlers
│   ├── init.rs         # House vault initialization
│   ├── place_bet.rs    # Bet placement logic
│   ├── result_bet.rs   # Bet resolution with randomness
│   └── refund_bet.rs   # Bet refund mechanism
└── state/              # Account state definitions
    └── bet.rs          # Bet account structure
```

## Contributing

### Development Setup

1. **Fork and Clone**
   ```bash
   git fork <repository-url>
   git clone <your-fork-url>
   cd dice
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
- **Comments**: Document complex logic, especially randomness generation
- **Testing**: Add comprehensive tests for edge cases
- **Security**: Always validate Ed25519 signatures and account constraints

### Pull Request Process

1. Ensure all tests pass and code is formatted
2. Add tests for new functionality
3. Update documentation if needed
4. Create detailed PR description explaining changes
5. Wait for code review and address feedback

### Common Gotchas

- **Randomness Verification**: Always validate Ed25519 signature format
- **PDA Seeds**: Use consistent seed derivation for bet accounts
- **Overflow Protection**: Handle large number calculations carefully
- **Timeout Logic**: Ensure proper slot-based timeout mechanisms
- **House Edge**: Maintain consistent edge calculations across payouts

---

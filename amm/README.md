# Solana AMM (Automated Market Maker)

A production-ready Automated Market Maker built on Solana using the Anchor framework. This AMM implements a constant product curve (x * y = k) for decentralized token swapping and liquidity provision.

## Features

- **Constant Product Curve**: Uses the proven x * y = k formula for price discovery
- **Liquidity Provision**: Deposit token pairs to earn LP tokens representing pool shares
- **Slippage Protection**: Built-in slippage controls for deposits and withdrawals
- **Fee Mechanism**: Configurable trading fees (in basis points)
- **Authority Controls**: Optional authority-based pool management
- **Pool Locking**: Emergency pool locking mechanism
- **PDA Security**: Program Derived Addresses for secure vault management

## Architecture

### Core Instructions

- **`init`**: Initialize a new AMM pool with two tokens
- **`deposit`**: Add liquidity and receive LP tokens
- **`withdraw`**: Remove liquidity by burning LP tokens

### State Management

- **Config**: Stores pool metadata, fee rates, and authority settings
- **Vaults**: Hold deposited tokens (Token X and Token Y)
- **LP Mint**: Issues liquidity provider tokens

## Quick Start

### Prerequisites

- Node.js 16+
- Rust 1.70+
- Solana CLI
- Anchor CLI 0.31.1+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd amm

# Install dependencies
yarn install

# Build the program
anchor build

# Run tests
anchor test
```

### Deployment

```bash
# Deploy to localnet
anchor deploy

# Deploy to devnet
anchor deploy --provider.cluster devnet
```

## Usage Examples

### Initialize a Pool

```typescript
await program.methods
  .init(seed, fee, authority)
  .accounts({
    initializer: provider.wallet.publicKey,
    mintX: tokenXMint,
    mintY: tokenYMint,
    // ... other accounts
  })
  .rpc();
```

### Add Liquidity

```typescript
await program.methods
  .deposit(amount, maxX, maxY)
  .accounts({
    user: provider.wallet.publicKey,
    mintX: tokenXMint,
    mintY: tokenYMint,
    // ... other accounts
  })
  .rpc();
```

### Remove Liquidity

```typescript
await program.methods
  .withdraw(amount, minX, minY)
  .accounts({
    user: provider.wallet.publicKey,
    // ... other accounts
  })
  .rpc();
```

## Configuration

### Fee Structure
- Fees are specified in basis points (1 basis point = 0.01%)
- Maximum fee: 10,000 basis points (100%)
- Example: `fee: 300` = 3% trading fee

### Security Features
- PDAs prevent unauthorized access to vaults
- Slippage protection prevents MEV attacks
- Authority controls for emergency operations
- Pool locking mechanism for maintenance

## Error Handling

The program includes comprehensive error handling:

- `InvalidAmount`: Zero or negative amounts
- `SlippageExceeded`: Price moved beyond tolerance
- `PoolLocked`: Operations on locked pools
- `InsufficientLiquidity`: Withdrawal exceeds available funds
- `InsufficientBalance`: User lacks required tokens

## Testing

Comprehensive test suite covers:
- Program structure validation
- Parameter boundary testing
- Slippage protection logic
- Constant product invariants
- Security validations

```bash
# Run full test suite
yarn test

# Run with verbose output
anchor test --skip-deploy
```

## Dependencies

- **Anchor Framework**: 0.31.1
- **SPL Token**: 0.4.13
- **Constant Product Curve**: Custom implementation

## Contributing

all contributions from the community are welcome! Whether you're fixing bugs, adding features, or improving documentation, your help is appreciated.

### How to Contribute

1. **Fork the repository** and create your feature branch
2. **Make your changes** with clear, descriptive commits
3. **Add tests** for new functionality
4. **Run the test suite** to ensure everything works
5. **Submit a pull request** with a clear description

### Contribution Guidelines

- Follow existing code style and patterns
- Include tests for new features or bug fixes
- Update documentation for significant changes
- Be respectful and constructive in discussions

---
Feel free to open an issue to discuss ideas before implementing major changes!


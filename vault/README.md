# Solana Vault Program

A secure and efficient Solana program built with the Anchor framework that allows users to create personal vaults for depositing, withdrawing, and managing SOL.

## 🚀 Features

- **Personal Vault Creation**: Each user can initialize their own vault with a unique Program Derived Address (PDA)
- **Secure Deposits**: Deposit SOL into your personal vault with built-in security measures
- **Flexible Withdrawals**: Withdraw any amount from your vault (up to available balance)
- **Vault Closure**: Close your vault and retrieve all remaining SOL
- **PDA-Based Security**: Uses Solana's Program Derived Addresses for enhanced security

## 🏗️ Architecture

### Program Structure

```
programs/vault/src/
├── lib.rs              # Main program entry points
└── instructions/
    ├── mod.rs          # Module exports
    ├── deposit.rs      # Deposit SOL to vault
    ├── withdraw.rs     # Withdraw SOL from vault
    └── close.rs        # Close vault and withdraw all funds
```

### Account Structure

- **Vault Account**: PDA derived from `["vault", vault_state_pubkey]`
- **Vault State Account**: PDA derived from `["state", user_pubkey]`
- **VaultState**: Stores vault and state bump seeds

## 📋 Prerequisites

- [Rust](https://rustup.rs/) (latest stable version)
- [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools) (v1.14+)
- [Anchor CLI](https://www.anchor-lang.com/docs/installation) (v0.31.1)
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [Yarn](https://yarnpkg.com/) package manager

## ⚙️ Setup

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd vault
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

4. **Build the program:**
   ```bash
   anchor build
   ```

5. **Deploy to local cluster:**
   ```bash
   anchor deploy
   ```

## 🧪 Testing

Run the comprehensive test suite:

```bash
anchor test
```

Or run tests with detailed output:
```bash
yarn test
```

## 🔧 Usage

### Initialize a Vault

```typescript
const tx = await program.methods
  .initialize()
  .accounts({
    signer: userKeypair.publicKey,
    vaultState: vaultStatePda,
    vault: vaultPda,
    systemProgram: SystemProgram.programId,
  })
  .rpc();
```

### Deposit SOL

```typescript
const depositAmount = new anchor.BN(1000000000); // 1 SOL in lamports

const tx = await program.methods
  .deposit(depositAmount)
  .accounts({
    signer: userKeypair.publicKey,
    vaultState: vaultStatePda,
    vault: vaultPda,
    systemProgram: SystemProgram.programId,
  })
  .rpc();
```

### Withdraw SOL

```typescript
const withdrawAmount = new anchor.BN(500000000); // 0.5 SOL in lamports

const tx = await program.methods
  .withdraw(withdrawAmount)
  .accounts({
    signer: userKeypair.publicKey,
    vaultState: vaultStatePda,
    vault: vaultPda,
    systemProgram: SystemProgram.programId,
  })
  .rpc();
```

### Close Vault

```typescript
const tx = await program.methods
  .close()
  .accounts({
    signer: userKeypair.publicKey,
    vaultState: vaultStatePda,
    vault: vaultPda,
    systemProgram: SystemProgram.programId,
  })
  .rpc();
```

## 🔍 Program Instructions

| Instruction | Description | Accounts Required |
|-------------|-------------|-------------------|
| `initialize` | Creates a new vault for the user | signer, vault_state, vault, system_program |
| `deposit` | Deposits SOL into the vault | signer, vault_state, vault, system_program |
| `withdraw` | Withdraws specified amount from vault | signer, vault_state, vault, system_program |
| `close` | Closes vault and withdraws all remaining SOL | signer, vault_state, vault, system_program |

## 🏛️ Program Details

- **Program ID**: `73EZ8zcZK6kjLQn4QWBGWtgXNsPZkAVGSKxG7ZFLifSZ`
- **Network**: Configured for localnet by default
- **Anchor Version**: 0.31.1
- **Solana Version**: Compatible with latest stable

## 🔐 Security Features

- **PDA-based Account Management**: All vault accounts use Program Derived Addresses for enhanced security
- **Signer Validation**: All operations require proper signature verification
- **Bump Seed Storage**: Vault and state bumps are stored to prevent PDA hijacking
- **Ownership Validation**: Only vault owners can perform operations on their vaults

## 🛠️ Development

### Project Structure

```
vault/
├── Anchor.toml         # Anchor configuration
├── Cargo.toml          # Rust workspace configuration
├── package.json        # Node.js dependencies
├── programs/           # Solana programs
│   └── vault/         # Main vault program
├── tests/             # TypeScript tests
├── migrations/        # Deployment scripts
└── app/              # Frontend application (if applicable)
```

### Available Scripts

- `yarn test`: Run test suite
- `yarn lint`: Check code formatting
- `yarn lint:fix`: Fix code formatting issues
- `anchor build`: Build the Solana program
- `anchor test`: Run Anchor tests
- `anchor deploy`: Deploy to configured cluster

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request



- Check the [Anchor documentation](https://www.anchor-lang.com/)
- Review [Solana documentation](https://docs.solana.com/)
- Open an issue in this repository

---

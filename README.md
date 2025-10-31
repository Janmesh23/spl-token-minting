Perfect — here’s your updated **README.md** with a neat GitHub badge section at the top (language, stars, forks, and license). It keeps the rest minimal and professional.

---

````markdown
# 🪙 Solana Token Demo

[![Made with JavaScript](https://img.shields.io/badge/Made%20with-JavaScript-yellow?style=for-the-badge&logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Solana](https://img.shields.io/badge/Blockchain-Solana-14F195?style=for-the-badge&logo=solana)](https://solana.com)
![GitHub Repo stars](https://img.shields.io/github/stars/<your-username>/solana-token-demo?style=for-the-badge)
![GitHub forks](https://img.shields.io/github/forks/<your-username>/solana-token-demo?style=for-the-badge)
![License](https://img.shields.io/github/license/<your-username>/solana-token-demo?style=for-the-badge)

A simple end-to-end project demonstrating how to **create, mint, transfer, and burn SPL tokens** on the Solana blockchain using JavaScript (`@solana/web3.js` and `@solana/spl-token`).

---

## 📦 Prerequisites

Before you begin, make sure you have:

- [Node.js](https://nodejs.org/) v18 or higher  
- [Solana CLI](https://docs.solana.com/cli/install-solana-cli) installed  
- A wallet keypair (Phantom or local) with some **Devnet SOL**

To check your Solana setup:
```bash
solana --version
solana config get
````

Make sure your CLI network is set to devnet:

```bash
solana config set --url https://api.devnet.solana.com
```

---

## 🚀 Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/<your-username>/solana-token-demo.git
   cd solana-token-demo
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up your environment variables**
   Create a `.env` file in the root folder:

   ```bash
   RPC_ENDPOINT=https://api.devnet.solana.com
   SECRET=<your_base58_secret_key_here>
   ```

   You can export your Phantom keypair or generate one via:

   ```bash
   solana-keygen new --outfile ~/.config/solana/id.json
   ```

   Then convert it to base58 if needed:

   ```bash
   node -e "console.log(require('bs58').encode(Uint8Array.from(require('fs').readFileSync(process.env.HOME + '/.config/solana/id.json').toString().match(/\d+/g).map(Number))))"
   ```

---

## 🧩 Scripts

### 1. Mint Tokens

Creates a new token mint, initializes it, creates an associated token account, and mints tokens.

```bash
npm run mint
```

Expected output:

```
Public Key: <your_wallet_pubkey>
Mint created (token mint address): <mint_address>
Token Account: <associated_token_account>
Tokens minted! Transaction: <explorer_url>
```

---

### 2. Transfer Tokens

Transfers tokens from your wallet’s token account to another wallet.

```bash
npm run transfer
```

Expected output:

```
Destination wallet: <random_generated_wallet>
Token accounts created and tokens transferred!
Transaction: <explorer_url>
```

---

### 3. Burn Tokens

Burns (permanently removes) a specified amount of tokens from your token account.

```bash
npm run burn
```

Expected output:

```
Tokens Burned! Transaction: <explorer_url>
```

---

## 🧠 Project Structure

```
solana-token-demo/
├── index.js           # Creates and mints the SPL token
├── transfer.js        # Handles token transfer between accounts
├── burn.js            # Burns tokens
├── package.json
├── .env
└── README.md
```

---

## 🧾 License

This project is open-source and free to use for educational purposes.
Licensed under the **MIT License**.

---

## 💡 Notes

* Each step logs a Solana Explorer link so you can verify transactions live on Devnet.
* If you want to use **Mainnet**, switch Phantom to Mainnet and update your `.env`:

  ```
  RPC_ENDPOINT=https://api.mainnet-beta.solana.com
  ```

  ⚠️ Mainnet transactions use real SOL!

---

✨ **Made by [ Janmesh ](https://github.com/Janmesh23)**

```

---

Would you like me to tweak the badges to **dark mode** (flat-square style, better for GitHub dark themes)?
```

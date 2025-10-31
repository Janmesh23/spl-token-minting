import fs from "fs";
import {
  Connection,
  clusterApiUrl,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";

import { getAccount, burn } from "@solana/spl-token";

// load wallet and meta info
const WALLET_FILE = "./wallet.json";
const META_FILE = "./meta.json";

// connect to devnet
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

const main = async () => {
  if (!fs.existsSync(WALLET_FILE) || !fs.existsSync(META_FILE)) {
    throw new Error("Missing wallet.json or meta.json — run mint script first!");
  }

  // load wallet
  const secret = JSON.parse(fs.readFileSync(WALLET_FILE));
  const keypair = Keypair.fromSecretKey(Uint8Array.from(secret));

  // load meta info
  const meta = JSON.parse(fs.readFileSync(META_FILE));
  const mintPubkey = new PublicKey(meta.mint);
  const tokenAccount = new PublicKey(meta.ata);
  const decimals = meta.decimals;

  console.log("Wallet:", keypair.publicKey.toBase58());
  console.log("Mint:", mintPubkey.toBase58());
  console.log("Token Account:", tokenAccount.toBase58());

  // check balance first
  const accountInfo = await getAccount(connection, tokenAccount);
  const balance = Number(accountInfo.amount);
  console.log(`Current token balance: ${balance / 10 ** decimals}`);

  // choose amount to burn
  const burnAmount = 100_000_000; // 100 tokens (if decimals = 6)

  if (balance < burnAmount) {
    throw new Error("Not enough tokens to burn!");
  }

  console.log(`Burning ${burnAmount / 10 ** decimals} tokens...`);

  // burn the tokens
  const tx = await burn(
    connection,
    keypair,          // payer
    tokenAccount,     // token account
    mintPubkey,       // mint
    keypair.publicKey,// owner
    burnAmount        // amount (in base units)
  );

  console.log(
    `✅ Tokens burned successfully! Explorer: https://explorer.solana.com/tx/${tx}?cluster=devnet`
  );

  // confirm updated balance
  const newInfo = await getAccount(connection, tokenAccount);
  console.log(
    `Updated balance: ${Number(newInfo.amount) / 10 ** decimals} tokens`
  );
};

main().catch((err) => console.error("Error:", err));

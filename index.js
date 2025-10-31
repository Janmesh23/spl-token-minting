import fs from "fs"; // to read/write files if needed

import {
  Connection,
  Keypair,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";

import { createMint } from "@solana/spl-token"; // to create a new token mint

import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token"; // to create a token account

import { getAccount } from "@solana/spl-token"; // to fetch token account info

import { mintTo } from "@solana/spl-token"; // to mint new tokens


const WALLET_FILE = "./wallet.json"; // file to save/load wallet keypair
const DECIMALS = 6; // same as in your createMint call

// Load or create wallet
let keypair; 
if (fs.existsSync(WALLET_FILE)) {
  const secret = JSON.parse(fs.readFileSync(WALLET_FILE)); // load secret key
  keypair = Keypair.fromSecretKey(Uint8Array.from(secret)); // create keypair
  console.log("Loaded wallet:", keypair.publicKey.toBase58()); // log public key
} else {
  keypair = Keypair.generate(); // generate new keypair
  fs.writeFileSync(WALLET_FILE, JSON.stringify(Array.from(keypair.secretKey))); // save secret key
  console.log("Generated new wallet:", keypair.publicKey.toBase58()); // log public key
  console.log(`Saved secret to ${WALLET_FILE}`); // log file save
}

// Connect to the Devnet cluster
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

const main = async () => {
  // Airdrop if balance is low (useful on devnet)
  const balance = await connection.getBalance(keypair.publicKey);
  if (balance < 1 * LAMPORTS_PER_SOL) {
    console.log("Airdropping 1 SOL...");
    // Request airdrop of 1 SOL
    const sig = await connection.requestAirdrop(
      keypair.publicKey,
      1 * LAMPORTS_PER_SOL
    );
    await connection.confirmTransaction(sig);
    console.log("Airdrop completed!");
  } else {
    console.log("Sufficient SOL balance:", balance / LAMPORTS_PER_SOL);
  }

  // Create a mint (if you already have a mint, you can skip this and set mintPubkey)
  const mintPubkey = await createMint(
    connection,
    keypair, // payer
    keypair.publicKey, // mint authority
    null, // freeze authority
    DECIMALS // decimals
  );
  console.log("Mint created (token mint address):", mintPubkey.toBase58());
  console.log(
    `View on Explorer: https://explorer.solana.com/address/${mintPubkey.toBase58()}?cluster=devnet`
  );

  // Create or get associated token account (ATA) for this wallet
  const ata = await getOrCreateAssociatedTokenAccount(
    connection,
    keypair, // payer
    mintPubkey, // mint
    keypair.publicKey // owner
  );
  console.log("Token Account (ATA):", ata.address.toBase58());

  // Mint tokens to the ATA
  const amountBaseUnits = 1_000_000_000; // example: 1_000_000_000 base units = 1000 tokens (if decimals=6)

  // Mint the tokens and get the transaction signature
  const txSig = await mintTo(
    connection,
    keypair, // payer
    mintPubkey, // mint
    ata.address, // destination ATA
    keypair.publicKey, // mint authority
    amountBaseUnits // amount in base units
  );
  console.log(
    `Tokens minted! Transaction: https://explorer.solana.com/tx/${txSig}?cluster=devnet`
  );

  // Fetch and print token account info (raw and human-readable)
  const accountInfo = await getAccount(connection, ata.address);
  const raw = accountInfo.amount;
  const human = Number(raw) / 10 ** DECIMALS;
  console.log(`Token balance (raw base units): ${raw}`);
  console.log(`Token balance (readable): ${human}`);

  // Save useful references for external scripts
  const meta = {
    walletPubkey: keypair.publicKey.toBase58(),
    mint: mintPubkey.toBase58(),
    ata: ata.address.toBase58(),
    decimals: DECIMALS,
  };
  fs.writeFileSync("./meta.json", JSON.stringify(meta, null, 2));
  console.log("Wrote meta.json with mint/ata info.");
};

main().catch((err) => {
  console.error("Error:", err);
});
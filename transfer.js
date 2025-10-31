import fs from "fs";
import {
  Connection,
  Keypair,
  clusterApiUrl,
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
} from "@solana/web3.js";

import {
  getOrCreateAssociatedTokenAccount,
  createAssociatedTokenAccountIdempotentInstruction,
  createTransferInstruction,
} from "@solana/spl-token";

const DECIMALS = 6; // same decimals as before
// const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
const connection = new Connection("https://api.devnet.solana.com", "confirmed");


// Load wallet + mint info from files
const secret = JSON.parse(fs.readFileSync("./wallet.json"));
const keypair = Keypair.fromSecretKey(Uint8Array.from(secret));

const meta = JSON.parse(fs.readFileSync("./meta.json")); // load mint + ATA info
const mintPubkey = new PublicKey(meta.mint); // mint pubkey
const sourceAta = new PublicKey(meta.ata); // source wallet's ATA

// Generate a destination wallet
const destination = Keypair.generate(); //  new random wallet
console.log("Destination wallet:", destination.publicKey.toBase58()); // log pubkey

// Create destination's ATA (if doesn’t exist)
const destinationTokenAccount = await getOrCreateAssociatedTokenAccount(
  connection,
  keypair, // payer
  mintPubkey, // mint
  destination.publicKey // owner
);

console.log("Destination token ATA:", destinationTokenAccount.address.toBase58());

// Create the transfer instruction
const transferInstruction = createTransferInstruction(
  sourceAta, // source
  destinationTokenAccount.address, // destination
  keypair.publicKey, // authority
  1e6 // transfer 1 token (since 6 decimals)
);

// Build + send transaction
const tx = new Transaction().add(transferInstruction);
const sig = await sendAndConfirmTransaction(connection, tx, [keypair]);

console.log(
  `✅ Tokens transferred! Explorer: https://explorer.solana.com/tx/${sig}?cluster=devnet`
);

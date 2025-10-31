import fs from "fs";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import { getAccount } from "@solana/spl-token";

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

// Read meta.json which index.js wrote (or replace with a literal ATA pubkey)
const meta = JSON.parse(fs.readFileSync("./meta.json", "utf8"));
const ataPubkey = new PublicKey(meta.ata);
const decimals = meta.decimals ?? 6;

const main = async () => {
  const accountInfo = await getAccount(connection, ataPubkey);
  const raw = accountInfo.amount;
  const human = Number(raw) / 10 ** decimals;
  console.log("Token Account:", ataPubkey.toBase58());
  console.log(`Token balance (raw base units): ${raw}`);
  console.log(`Token balance (readable): ${human}`);
};

main().catch((err) => console.error(err));

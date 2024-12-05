import dotenv from 'dotenv';
dotenv.config();

export const CONFIG = {
  CLUSTER_URL: process.env.SOLANA_CLUSTER_URL || 'https://api.devnet.solana.com',
  PROGRAM_ID: process.env.PROGRAM_ID || 'DEFuzL6ArEcszLSgy1pQBLSdyBd7BKR5CUdckq2RXn2A',
  WALLET_PATH: process.env.WALLET_PATH
};
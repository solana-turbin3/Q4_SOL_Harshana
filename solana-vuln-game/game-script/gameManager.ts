import * as anchor from "@coral-xyz/anchor";
import { Keypair, PublicKey, Connection } from "@solana/web3.js";
import * as fs from "fs";
import inquirer from 'inquirer';
import chalk from 'chalk';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddressSync } from "@solana/spl-token";
import figlet from 'figlet';
import { CONFIG } from './gameConfig';
import { CHALLENGES, Challenge } from './gameChallenge';
import { SolanaVulnGame } from "../target/types/solana_vuln_game";
import bs58 from "bs58"
import walletSec from "../walletSec.json"

export class SolanaVulnerabilityGame {
  //@ts-ignore
  private program: anchor.Program<SolanaVulnGame>;
  private wallet: Keypair;
  private provider: anchor.AnchorProvider;

  constructor(
    //@ts-ignore
    program: anchor.Program<SolanaVulnGame>, 
    wallet: Keypair, 
    provider: anchor.AnchorProvider
  ) {
    this.program = program;
    this.wallet = wallet;
    this.provider = provider;
  }

  static async initialize(): Promise<SolanaVulnerabilityGame> {
    // Load wallet
    const wallet = Keypair.fromSecretKey(
      Uint8Array.from(bs58.decode(walletSec.secret))
    );

    // Setup connection
    const connection = new Connection(CONFIG.CLUSTER_URL, 'confirmed');
    //@ts-ignore
    const provider = new anchor.AnchorProvider(connection, wallet, {
      preflightCommitment: 'confirmed'
    });

    // Load program
    const programId = new PublicKey(CONFIG.PROGRAM_ID);
    const idl = JSON.parse(fs.readFileSync("../target/idl/solana_vuln_game.json", 'utf8'));
    //@ts-ignore
    const program = new anchor.Program(idl, programId, provider) as anchor.Program<SolanaVulnGame>;

    return new SolanaVulnerabilityGame(program, wallet, provider);
  }

  async playChallenge(challenge: Challenge): Promise<boolean> {
    try {
      console.log(chalk.yellow(`\n🕹️ Challenge: ${challenge.name}`));
      console.log(chalk.blue(challenge.description));

      // Optional: Show hints
      if (challenge.hints && Math.random() < 0.3) { // 30% chance of showing a hint
        const randomHint = challenge.hints[Math.floor(Math.random() * challenge.hints.length)];
        console.log(chalk.green(`💡 Hint: ${randomHint}`));
      }

      const { answer } = await inquirer.prompt([
        {
          type: 'input',
          name: 'answer',
          message: 'Enter your solution:'
        }
      ]);

      const [configPda] = await PublicKey.findProgramAddress(
        [Buffer.from("config")],
        this.program.programId
      );

      const [userPda] = await PublicKey.findProgramAddress(
        [Buffer.from("user_account"), this.wallet.publicKey.toBuffer()],
        this.program.programId
      );

      const [mintPda] = await PublicKey.findProgramAddress(
        [Buffer.from("payment_token"), this.wallet.publicKey.toBuffer(), configPda.toBuffer()],
        this.program.programId
      );
      
      const userAta = getAssociatedTokenAddressSync(mintPda, this.wallet.publicKey);

      // @ts-ignore
      await this.program.methods[challenge.function as keyof SolanaVulnGame["methods"]](answer)
        .accounts({
          signer: this.wallet.publicKey,
          config: configPda,
          user: userPda,
          mintAccount: mintPda,
          userAta: userAta,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID
        })
        .rpc();

      console.log(chalk.green('✅ Correct Solution! 100 Points Awarded'));
      return true;
    } catch (error: any) {
      console.log(chalk.red('❌ Incorrect Solution'));
      console.log(chalk.dim(error.message));
      return false;
    }
  }

  async startGame() {
    console.log(
      chalk.cyan(
        figlet.textSync('Solana Vuln Game', { 
          font: 'Small', 
          horizontalLayout: 'default', 
          verticalLayout: 'default' 
        })
      )
    );

    console.log(chalk.yellow('🎮 Welcome to the Solana Vulnerability Challenge! 🛡️'));

    while (true) {
      const { challenge } = await inquirer.prompt([
        {
          type: 'list',
          name: 'challenge',
          message: 'Select a Vulnerability Challenge:',
          choices: [
            ...CHALLENGES.map(c => c.name),
            new inquirer.Separator(),
            'Quit Game'
          ]
        }
      ]);

      if (challenge === 'Quit Game') {
        console.log(chalk.green('Thanks for playing! Goodbye! 👋'));
        break;
      }

      const selectedChallenge = CHALLENGES.find(c => c.name === challenge);
      if (selectedChallenge) {
        await this.playChallenge(selectedChallenge);
      }
    }
  }
}

// Main execution
async function main() {
  try {
    const game = await SolanaVulnerabilityGame.initialize();
    await game.startGame();
  } catch (error) {
    console.error(chalk.red('Game Initialization Failed:'), error);
  }
}

main();
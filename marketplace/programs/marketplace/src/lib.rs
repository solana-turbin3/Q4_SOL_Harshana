use anchor_lang::prelude::*;

declare_id!("9gA4CdEkkvKSXr23a7rsNjtpFaEdFvSa5Kj5BL6ASpqC");

#[program]
pub mod marketplace {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

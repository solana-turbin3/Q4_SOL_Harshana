use anchor_lang::prelude::*;

pub mod state;
pub mod instructions;
pub mod error;

declare_id!("9gA4CdEkkvKSXr23a7rsNjtpFaEdFvSa5Kj5BL6ASpqC");

pub use state::*;
pub use instructions::*;

#[program]
pub mod marketplace {
    use super::*;

    pub fn initialize(ctx: Context<InitializeMarketplace>, name: String, fee: u16) -> Result<()> {
        ctx.accounts.init(name, fee, &ctx.bumps)
    }

    pub fn create_new_listing(ctx: Context<List>, price: u64) -> Result<()> {
        ctx.accounts.create_listing(price, &ctx.bumps)?;
        ctx.accounts.deposit_nft()?;
        Ok(())
    }
}

use anchor_lang::prelude::*;
use anchor_spl::token_interface::{Mint, TokenInterface};

use crate::state::Marketplace;
use crate::error::MarketplaceError;

#[derive(Accounts)]
#[instruction(name: String)]
pub struct InitializeMarketplace<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,

    #[account(
        init,
        payer = admin,
        seeds = [b"marketplace", name.as_bytes()],
        space = Marketplace::INIT_SPACE,
        bump
    )]
    pub marketplace: Account<'info, Marketplace>,
    // accounts that deal directly with SOL are assigned System Account.
    #[account(
        seeds = [b"treasury", marketplace.key().as_ref()],
        bump
    )]
    pub treasury: SystemAccount<'info>,
    // platform rewards
    #[account(
        init,
        payer = admin,
        seeds = [b"rewards",marketplace.key().as_ref()],
        bump,
        mint::decimals = 6,
        mint::authority = marketplace
    )]
    pub rewards_mint: InterfaceAccount<'info, Mint>,
    pub system_program: Program<'info, System>,
    pub token_program: Interface<'info, TokenInterface>
}

impl<'info> InitializeMarketplace<'info> {
    pub fn init(&mut self, name: String, fee: u16, bumps: &InitializeMarketplaceBumps) -> Result<()> {
        require!(
            !name.is_empty() && name.len() < 4 + 33,
            MarketplaceError::NameTooLong
        );

        self.marketplace.set_inner(Marketplace {
            admin: self.admin.key(),
            fee,
            rewards_bump: bumps.rewards_mint,
            treasury_bump: bumps.treasury,
            state_bump: bumps.marketplace,
            name
        });
        Ok(())
    }
} 


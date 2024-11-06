use anchor_lang::prelude::*;

#[error_code]
pub enum MarketplaceError {
    #[msg("The length of given name is too long")]
    NameTooLong,
}
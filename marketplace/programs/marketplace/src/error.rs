use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("Not the owner of this listing")]
    NotOwner,
    #[msg("Invalid marketplace fee - must be between 0 and 1000 basis points (10%)")]
    InvalidFee,
    #[msg("Price cannot be zero")]
    InvalidPrice,
    #[msg("Collection not verified")]
    CollectionNotVerified,
    #[msg("Insufficient funds for purchase")]
    InsufficientFunds,
    #[msg("Arithmetic overflow")]
    ArithmeticOverflow,
}

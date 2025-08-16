use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Vote {
    pub authority: Pubkey,
    pub vote_type: u8,
    pub vote_credits: u64,
    pub bump: u8,
}

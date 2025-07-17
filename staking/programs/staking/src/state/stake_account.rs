use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct StakeAccount {
    pub owner: Pubkey,
    pub mint: Pubkey,
    pub staked_at: i64, // i64(signed int) used because time can't be negative
    pub bump: u8,
}

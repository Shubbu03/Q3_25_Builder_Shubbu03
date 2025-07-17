use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct StakeConfig {
    pub points_per_stake: u8,
    pub max_stake: u8,     // max amount of nft to stake
    pub freeze_period: u32, // for how long to lock the nft
    pub rewards_bump: u8,
    pub bump: u8, //config bump
}

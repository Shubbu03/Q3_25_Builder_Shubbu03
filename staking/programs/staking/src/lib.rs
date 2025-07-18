#![allow(unexpected_cfgs,deprecated)]
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use instructions::*;
pub use state::*;

declare_id!("Apphghx7H66r2nqMGdcskXhZoLQUCLaVPKuaCiEVUE2H");

#[program]
pub mod staking {
    use super::*;

    pub fn initialise_config(
        ctx: Context<InitialiseConfig>,
        points_per_stake: u8,
        max_stake: u8,
        freeze_period: u32,
    ) -> Result<()> {
        ctx.accounts
            .initialise_config(points_per_stake, max_stake, freeze_period, &ctx.bumps)
    }
    pub fn initialise_user(ctx: Context<InitialiseUser>) -> Result<()> {
        ctx.accounts.initialise_user(&ctx.bumps)
    }

    pub fn stake(ctx: Context<Stake>) -> Result<()> {
        ctx.accounts.stake(&ctx.bumps)
    }
    pub fn unstake(ctx: Context<Unstake>) -> Result<()> {
        ctx.accounts.unstake()
    }

    pub fn claim_rewards(ctx: Context<ClaimRewards>) -> Result<()> {
        ctx.accounts.claim_rewards()
    }
}

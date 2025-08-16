#![allow(unexpected_cfgs, deprecated)]
pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("FRFVWFhAzsaBBoeZDfizUx4eFpjZvFrz9uRxBXDthQvK");

#[program]
pub mod quadratic_voting {
    use super::*;

    pub fn initialize_dao(ctx: Context<InitializeDao>, name: String) -> Result<()> {
        ctx.accounts.init_dao(name, ctx.bumps.dao)
    }
    pub fn initialize_proposal(ctx: Context<InitializeProposal>, metadata: String) -> Result<()> {
        ctx.accounts.init_proposal(metadata, ctx.bumps.proposal)
    }
    pub fn cast_vote(ctx: Context<CastVote>, vote_type: u8) -> Result<()> {
        ctx.accounts.cast_vote(vote_type, ctx.bumps.vote_account)
    }
}

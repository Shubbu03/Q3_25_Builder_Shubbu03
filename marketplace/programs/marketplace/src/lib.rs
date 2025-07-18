#![allow(unexpected_cfgs,deprecated)]
pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("Hd98jmFudemVPbdArdHmCSTWayaqhhsgwAUd3abNC8DB");

#[program]
pub mod marketplace {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        initialize::handler(ctx)
    }
}

use anchor_lang::prelude::*;

use crate::{Dao, ANCHOR_DISCRIMINATOR};

#[derive(Accounts)]
#[instruction(name:String)]
pub struct InitializeDao<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,

    #[account(
        init,
        payer = creator,
        space = ANCHOR_DISCRIMINATOR + Dao::INIT_SPACE,
        seeds = [b"dao", creator.key().as_ref(), name.as_bytes()],
        bump
    )]
    pub dao: Account<'info, Dao>,

    pub system_program: Program<'info, System>,
}

impl<'info> InitializeDao<'info> {
    pub fn init_dao(&mut self, name: String, bump: u8) -> Result<()> {
        self.dao.set_inner(Dao {
            name,
            authority: self.creator.key(),
            proposal_count: 0,
            bump,
        });

        Ok(())
    }
}

use anchor_lang::prelude::*;
use anchor_spl::token::TokenAccount;

use crate::{Dao, Proposal, Vote, ANCHOR_DISCRIMINATOR};

#[derive(Accounts)]
pub struct CastVote<'info> {
    #[account(mut)]
    pub voter: Signer<'info>,

    pub dao: Account<'info, Dao>,

    #[account(mut)]
    pub proposal: Account<'info, Proposal>,

    #[account(
        init,
        payer = voter,
        space = ANCHOR_DISCRIMINATOR + Vote::INIT_SPACE,
        seeds = [b"vote", voter.key().as_ref(), proposal.key().as_ref()],
        bump
    )]
    pub vote_account: Account<'info, Vote>,

    #[account(
        token::authority = voter
    )]
    pub creator_token_account: Account<'info, TokenAccount>,

    pub system_program: Program<'info, System>,
}

impl<'info> CastVote<'info> {
    pub fn cast_vote(&mut self, vote_type: u8, bump: u8) -> Result<()> {
        let voting_credits = (self.creator_token_account.amount as f64).sqrt() as u64;

        if vote_type == 1 {
            self.proposal.yes_vote_count += voting_credits;
        } else {
            self.proposal.no_vote_count += voting_credits;
        }

        self.vote_account.set_inner(Vote {
            authority: self.voter.key(),
            vote_type,
            vote_credits: voting_credits,
            bump,
        });

        Ok(())
    }
}

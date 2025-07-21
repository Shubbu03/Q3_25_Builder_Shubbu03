use anchor_lang::prelude::*;

use anchor_spl::token_interface::{Mint, TokenInterface};

use crate::{error::ErrorCode, Marketplace};

#[derive(Accounts)]
#[instruction(name:String)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,

    #[account(
        init,
        payer = admin,
        space = 8 + Marketplace::INIT_SPACE,
        seeds = [b"marketplace", name.as_str().as_bytes()],
        bump
    )]
    pub marketplace: Account<'info, Marketplace>,

    #[account(
        seeds = [b"treasury", marketplace.key().as_ref()],
        bump
    )]
    pub treasury: SystemAccount<'info>, // sys account because we are only collecting SOL/lamports in this

    #[account(
        init,
        payer = admin,
        seeds = [b"rewards", marketplace.key().as_ref()],
        bump,
        mint::decimals = 6,
        mint::authority = marketplace
    )]
    pub rewards_mint: InterfaceAccount<'info, Mint>,

    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
}

impl<'info> Initialize<'info> {
    pub fn initialize(&mut self, name: String, fee: u16, bumps: &InitializeBumps) -> Result<()> {
        // Input validation
        require!(fee <= 1000, ErrorCode::InvalidFee); // Max 10% fee (1000 basis points)
        require!(
            !name.is_empty() && name.len() <= 32,
            ErrorCode::InvalidPrice
        );

        // mut self used because we are modifying the marketplace itself
        self.marketplace.set_inner(Marketplace {
            admin: self.admin.key(),
            fee,
            bump: bumps.marketplace,
            treasury_bump: bumps.treasury,
            rewards_bump: bumps.rewards_mint,
            name,
        });
        Ok(())
    }
}

use anchor_lang::{
    prelude::*,
    system_program::{transfer, Transfer},
};

use anchor_spl::{
    associated_token::AssociatedToken,
    token_interface::{
        close_account, transfer_checked, CloseAccount, Mint, TokenAccount, TokenInterface,
        TransferChecked,
    },
};

use crate::{error::ErrorCode, Listing, Marketplace};

#[derive(Accounts)]
pub struct Purchase<'info> {
    #[account(mut)]
    pub taker: Signer<'info>,

    /// CHECK: This is the seller who will receive payment
    #[account(mut)]
    pub maker: SystemAccount<'info>,

    #[account(
        seeds = [b"marketplace", marketplace.name.as_str().as_bytes()],
        bump = marketplace.bump
    )]
    pub marketplace: Account<'info, Marketplace>,

    pub maker_mint: InterfaceAccount<'info, Mint>,

    #[account(
        mut,
        associated_token::mint = maker_mint,
        associated_token::authority = listing
    )]
    pub vault: InterfaceAccount<'info, TokenAccount>,

    #[account(
        mut,
        close = maker,
        seeds = [marketplace.key().as_ref(), maker_mint.key().as_ref()],
        bump = listing.bump
    )]
    pub listing: Account<'info, Listing>,

    #[account(
        init_if_needed,
        payer = taker,
        associated_token::mint = maker_mint,
        associated_token::authority = taker
    )]
    pub taker_ata: InterfaceAccount<'info, TokenAccount>,

    #[account(
        mut,
        seeds = [b"treasury", marketplace.key().as_ref()],
        bump = marketplace.treasury_bump
    )]
    pub treasury: SystemAccount<'info>,

    #[account(
        mut,
        seeds = [b"rewards", marketplace.key().as_ref()],
        bump = marketplace.rewards_bump,
        mint::authority = marketplace
    )]
    pub rewards_mint: InterfaceAccount<'info, Mint>,

    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
}

impl<'info> Purchase<'info> {
    pub fn send_sol(&self) -> Result<()> {
        // Calculate marketplace fee (basis points: fee/10000)
        let marketplace_fee = self
            .listing
            .price
            .checked_mul(self.marketplace.fee as u64)
            .ok_or(ErrorCode::ArithmeticOverflow)?
            .checked_div(10000)
            .ok_or(ErrorCode::ArithmeticOverflow)?;

        // Calculate seller amount (listing price - marketplace fee)
        let seller_amount = self
            .listing
            .price
            .checked_sub(marketplace_fee)
            .ok_or(ErrorCode::ArithmeticOverflow)?;

        // Verify taker has sufficient funds
        require!(
            self.taker.lamports() >= self.listing.price,
            ErrorCode::InsufficientFunds
        );

        // Transfer payment to seller
        let seller_transfer_account = Transfer {
            from: self.taker.to_account_info(),
            to: self.maker.to_account_info(),
        };

        let seller_cpi_ctx =
            CpiContext::new(self.system_program.to_account_info(), seller_transfer_account);

        transfer(seller_cpi_ctx, seller_amount)?;

        // Transfer marketplace fee to treasury (only if fee > 0)
        if marketplace_fee > 0 {
            let fee_transfer = Transfer {
                from: self.taker.to_account_info(),
                to: self.treasury.to_account_info(),
            };

            let fee_cpi_ctx = CpiContext::new(self.system_program.to_account_info(), fee_transfer);

            transfer(fee_cpi_ctx, marketplace_fee)?;
        }

        Ok(())
    }

    pub fn purchase_nft(&mut self) -> Result<()> {
        // 1. Transfer NFT from vault to taker ata
        let seeds = &[
            &self.marketplace.key().to_bytes()[..],
            &self.maker_mint.key().to_bytes()[..],
            &[self.listing.bump],
        ];
        let signer_seeds = &[&seeds[..]];

        let accounts = TransferChecked {
            from: self.vault.to_account_info(),
            mint: self.maker_mint.to_account_info(),
            to: self.taker_ata.to_account_info(),
            authority: self.listing.to_account_info(),
        };

        let cpi_ctx = CpiContext::new_with_signer(
            self.token_program.to_account_info(),
            accounts,
            signer_seeds,
        );

        transfer_checked(cpi_ctx, 1, self.maker_mint.decimals)?;

        // 2. Close vault account and return rent to maker
        let accounts = CloseAccount {
            account: self.vault.to_account_info(),
            destination: self.maker.to_account_info(),
            authority: self.listing.to_account_info(),
        };

        let cpi_ctx = CpiContext::new_with_signer(
            self.token_program.to_account_info(),
            accounts,
            signer_seeds,
        );

        close_account(cpi_ctx)?;

        Ok(())
    }
}

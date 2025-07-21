use anchor_lang::prelude::*;

use anchor_spl::{
    associated_token::AssociatedToken,
    token_interface::{
        close_account, transfer_checked, CloseAccount, Mint, TokenAccount, TokenInterface,
        TransferChecked,
    },
};

use crate::{error::ErrorCode, Listing, Marketplace};

#[derive(Accounts)]
pub struct Delist<'info> {
    #[account(mut)]
    pub maker: Signer<'info>,

    #[account(
        seeds = [b"marketplace", marketplace.name.as_str().as_bytes()],
        bump = marketplace.bump
    )]
    pub marketplace: Account<'info, Marketplace>,

    pub maker_mint: InterfaceAccount<'info, Mint>,
    pub collection_mint: InterfaceAccount<'info, Mint>,

    #[account(
        mut,
        associated_token::mint = maker_mint,
        associated_token::authority = maker
    )]
    pub maker_ata: InterfaceAccount<'info, TokenAccount>,

    #[account(
        mut,
        close = maker,
        seeds = [marketplace.key().as_ref(), maker_mint.key().as_ref()],
        bump = listing.bump,
        constraint = listing.maker == maker.key() @ ErrorCode::NotOwner
    )]
    pub listing: Account<'info, Listing>,

    #[account(
        mut,
        associated_token::mint = maker_mint,
        associated_token::authority = listing
    )]
    pub vault: InterfaceAccount<'info, TokenAccount>,

    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
}

impl<'info> Delist<'info> {
    pub fn delist_nft(&mut self) -> Result<()> {
        // 1. Delisting the NFT
        let cpi_program = self.token_program.to_account_info();
        let cpi_account = TransferChecked {
            from: self.vault.to_account_info(),
            mint: self.maker_mint.to_account_info(),
            to: self.maker_ata.to_account_info(),
            authority: self.listing.to_account_info(),
        };

        //DUMB WAY -
        // let seeds = &[
        //     self.marketplace.to_account_info().key.as_ref(),
        //     self.maker_mint.to_account_info().key.as_ref(),
        //     &[self.marketplace.bump],
        // ];

        //BETTER APPROACH -
        let seeds = &[
            &self.marketplace.key().to_bytes()[..],
            &self.maker_mint.key().to_bytes()[..],
            &[self.listing.bump],
        ];

        let signer_seeds = &[&seeds[..]];

        let cpi_context = CpiContext::new_with_signer(cpi_program, cpi_account, signer_seeds);

        transfer_checked(cpi_context, 1, self.maker_mint.decimals)?;

        // 2. Close the vault account and return rent to maker
        let close_accounts_cpi = CloseAccount {
            account: self.vault.to_account_info(),
            destination: self.maker.to_account_info(),
            authority: self.listing.to_account_info(),
        };

        let close_cpi_context = CpiContext::new_with_signer(
            self.token_program.to_account_info(),
            close_accounts_cpi,
            signer_seeds,
        );

        close_account(close_cpi_context)?;

        Ok(())
    }
}

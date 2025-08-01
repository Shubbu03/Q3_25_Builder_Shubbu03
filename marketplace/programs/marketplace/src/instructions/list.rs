use anchor_lang::prelude::*;

use anchor_spl::{
    associated_token::AssociatedToken,
    metadata::{MasterEditionAccount, Metadata, MetadataAccount},
    token_interface::{transfer_checked, Mint, TokenAccount, TokenInterface, TransferChecked},
};

use crate::{Listing, Marketplace, error::ErrorCode};

#[derive(Accounts)]
pub struct List<'info> {
    #[account(mut)]
    pub maker: Signer<'info>,

    #[account(
        seeds = [b"marketplace", marketplace.name.as_str().as_bytes()],
        bump = marketplace.bump
    )]
    pub marketplace: Account<'info, Marketplace>,

    pub maker_mint: InterfaceAccount<'info, Mint>,
    pub collection_mint: InterfaceAccount<'info,Mint>, 

    #[account(
        mut,
        associated_token::mint = maker_mint,
        associated_token::authority = maker,
        constraint = maker_ata.amount == 1 @ ErrorCode::InsufficientFunds
    )]
    pub maker_ata: InterfaceAccount<'info, TokenAccount>,

    #[account(
        init,
        payer = maker,
        space = 8 + Listing::INIT_SPACE,
        seeds = [marketplace.key().as_ref(), maker_mint.key().as_ref()],
        bump
    )]
    pub listing: Account<'info, Listing>,

    #[account(
        init,
        payer = maker,
        associated_token::mint = maker_mint,
        associated_token::authority = listing
    )]
    pub vault: InterfaceAccount<'info, TokenAccount>,

    #[account(
        seeds = [b"metadata", metadata_program.key().as_ref(), maker_mint.key().as_ref()],
        seeds::program = metadata_program.key(),
        bump,
        constraint = metadata.collection.as_ref().unwrap().key.as_ref() == collection_mint.key().as_ref() @ ErrorCode::CollectionNotVerified,
        constraint = metadata.collection.as_ref().unwrap().verified == true @ ErrorCode::CollectionNotVerified,
    )]
    pub metadata: Account<'info, MetadataAccount>,

    #[account(
        seeds = [b"metadata", metadata_program.key().as_ref(), maker_mint.key().as_ref(), b"edition"],
        seeds::program = metadata_program.key(),
        bump
        
    )]
    pub master_edition: Account<'info, MasterEditionAccount>,
    
    pub metadata_program: Program<'info, Metadata>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
}

impl<'info> List<'info> {
    pub fn create_listing(&mut self, price: u64, bumps: &ListBumps) -> Result<()> {
        // Input validation
        require!(price > 0, ErrorCode::InvalidPrice);
        
        self.listing.set_inner(Listing { 
            maker: self.maker.key(), 
            maker_mint: self.maker_mint.key(), 
            price, 
            bump: bumps.listing 
        });
        Ok(())
    }

    pub fn deposit_nft(&mut self) -> Result<()>{
        let cpi_program = self.token_program.to_account_info();
        let cpi_account = TransferChecked{
            from: self.maker_ata.to_account_info(),
            mint: self.maker_mint.to_account_info(),
            to: self.vault.to_account_info(),
            authority: self.maker.to_account_info() 
        };

        let cpi_context = CpiContext::new(cpi_program, cpi_account);

        transfer_checked(cpi_context, self.maker_ata.amount, self.maker_mint.decimals)?; //amount can also be set as 1 directly because its nft
        Ok(())
    }
}

use anchor_lang::prelude::*;

//this is a pda which holds NFT to be put up for listing
#[account]
#[derive(InitSpace)]
pub struct Listing {
    pub maker: Pubkey,
    pub maker_mint: Pubkey, //this will be unique enough so no need for collection field
    pub price: u64,
    pub bump: u8,
}

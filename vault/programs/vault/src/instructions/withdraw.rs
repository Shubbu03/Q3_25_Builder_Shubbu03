use anchor_lang::{
    prelude::*,
    system_program::{transfer, Transfer},
};

use crate::VaultState;

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        mut,
        seeds = [
            b"vault",
            vault_state.key().as_ref()
        ],
        bump = vault_state.vault_bump
    )]
    pub vault: SystemAccount<'info>,
    #[account(
        seeds = [
            b"state",
            signer.key().as_ref()
        ],
        bump = vault_state.state_bump
    )]
    pub vault_state: Account<'info, VaultState>,
    pub system_program: Program<'info, System>,
}

impl<'info> Withdraw<'info> {
    pub fn withdraw(&mut self, amount: u64) -> Result<()> {
        let cpi_program = self.system_program.to_account_info();

        let cpi_accounts = Transfer {
            from: self.vault.to_account_info(),
            to: self.signer.to_account_info(),
        };

        let signer_seeds = [
            b"vault",
            self.vault_state.to_account_info().key.as_ref(), // we use key simply and not key() because we dont need the actual pubkey here which will be returned by key()
            &[self.vault_state.vault_bump],
        ];

        let seeds = &[&signer_seeds[..]];

        let cpi_context = CpiContext::new_with_signer(cpi_program, cpi_accounts, seeds);

        transfer(cpi_context, amount)?;
        Ok(())
    }
}

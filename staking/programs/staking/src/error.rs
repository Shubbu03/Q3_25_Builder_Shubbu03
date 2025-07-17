use anchor_lang::prelude::*;

#[error_code]
pub enum StakeError {
    #[msg("Max stake limit reached")]
    MaxStaked,
    #[msg("Time not elapsed for unstaking")]
    TimeNotElapsed,
    #[msg("No rewards to claim")]
    NoRewardsToClaim,
}

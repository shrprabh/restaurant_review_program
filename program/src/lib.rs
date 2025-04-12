pub mod instruction;
pub mod state;

use crate::instruction::ReviewInstruction;
use crate::state::AccountState;
use crate::state::ReviewError;
use borsh::BorshSerialize;
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    borsh0_10::try_from_slice_unchecked,
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program::invoke_signed,
    program_error::ProgramError,
    program_pack::IsInitialized,
    pubkey::Pubkey,
    system_instruction,
    sysvar::{rent::Rent, Sysvar},
};
use std::convert::TryInto;

entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let instruction = ReviewInstruction::unpack(instruction_data)?;
    match instruction {
        ReviewInstruction::AddReview {
            from_institution,
            from_state_province,
            from_country,
            to_institution,
            to_country,
            date_started,
            date_ended,
            ending_salary,
            ending_currency,
            new_salary,
            new_currency,
            date_transferred,
            skills_earned,
            description,
            rating,
            behaviour,
            created_at,
        } => add_review(
            program_id,
            accounts,
            from_institution,
            from_state_province,
            from_country,
            to_institution,
            to_country,
            date_started,
            date_ended,
            ending_salary,
            ending_currency,
            new_salary,
            new_currency,
            date_transferred,
            skills_earned,
            description,
            rating,
            behaviour,
            created_at,
        ),
        ReviewInstruction::UpdateReview {
            from_institution,
            from_state_province,
            from_country,
            to_institution,
            to_country,
            date_started,
            date_ended,
            ending_salary,
            ending_currency,
            new_salary,
            new_currency,
            date_transferred,
            skills_earned,
            description,
            rating,
            behaviour,
            created_at,
        } => update_review(
            program_id,
            accounts,
            from_institution,
            from_state_province,
            from_country,
            to_institution,
            to_country,
            date_started,
            date_ended,
            ending_salary,
            ending_currency,
            new_salary,
            new_currency,
            date_transferred,
            skills_earned,
            description,
            rating,
            behaviour,
            created_at,
        ),
    }
}

pub fn add_review(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    from_institution: String,
    from_state_province: String,
    from_country: String,
    to_institution: String,
    to_country: String,
    date_started: String,
    date_ended: String,
    ending_salary: u64,
    ending_currency: String,
    new_salary: u64,
    new_currency: String,
    date_transferred: String,
    skills_earned: Vec<String>,
    description: String,
    rating: u8,
    behaviour: String,
    created_at: String,
) -> ProgramResult {
    msg!("Adding review...");
    msg!("From Institution: {}", from_institution);
    msg!("From State/Province: {}", from_state_province);
    msg!("From Country: {}", from_country);
    msg!("To Institution: {}", to_institution);
    msg!("To Country: {}", to_country);
    msg!("Date Started: {}", date_started);
    msg!("Date Ended: {}", date_ended);
    msg!("Ending Salary: {}", ending_salary);
    msg!("Ending Currency: {}", ending_currency);
    msg!("New Salary: {}", new_salary);
    msg!("New Currency: {}", new_currency);
    msg!("Date Transferred: {}", date_transferred);
    msg!("Skills Earned: {:?}", skills_earned);
    msg!("Description: {}", description);
    msg!("Rating: {}", rating);
    msg!("Behaviour: {}", behaviour);
    msg!("Created At: {}", created_at);

    let account_info_iter = &mut accounts.iter();
    let initializer = next_account_info(account_info_iter)?;
    let pda_account = next_account_info(account_info_iter)?;
    let system_program = next_account_info(account_info_iter)?;

    if !initializer.is_signer {
        msg!("Missing required signature");
        return Err(ProgramError::MissingRequiredSignature);
    }

    // Using from_institution as seed data for PDA derivation (adjust as needed)
    let seed_data = from_institution.as_bytes();
    let (pda, bump_seed) = Pubkey::find_program_address(
        &[initializer.key.as_ref(), seed_data],
        program_id,
    );
    if pda != *pda_account.key {
        msg!("Invalid seeds for PDA");
        return Err(ProgramError::InvalidArgument);
    }

    if rating > 10 || rating < 1 {
        return Err(ReviewError::InvalidRating.into());
    }

    let account_len: usize = 1000;
    let rent = Rent::get()?;
    let rent_lamports = rent.minimum_balance(account_len);

    invoke_signed(
        &system_instruction::create_account(
            initializer.key,
            pda_account.key,
            rent_lamports,
            account_len.try_into().unwrap(),
            program_id,
        ),
        &[
            initializer.clone(),
            pda_account.clone(),
            system_program.clone(),
        ],
        &[&[
            initializer.key.as_ref(),
            seed_data,
            &[bump_seed],
        ]],
    )?;

    msg!("PDA created: {}", pda);
    msg!("Unpacking state account");

    let mut account_data =
        try_from_slice_unchecked::<AccountState>(&pda_account.data.borrow()).unwrap();

    msg!("Checking if account is already initialized");
    if account_data.is_initialized() {
        msg!("Account already initialized");
        return Err(ProgramError::AccountAlreadyInitialized);
    }

    account_data.from_institution = from_institution;
    account_data.from_state_province = from_state_province;
    account_data.from_country = from_country;
    account_data.to_institution = to_institution;
    account_data.to_country = to_country;
    account_data.date_started = date_started;
    account_data.date_ended = date_ended;
    account_data.ending_salary = ending_salary;
    account_data.ending_currency = ending_currency;
    account_data.new_salary = new_salary;
    account_data.new_currency = new_currency;
    account_data.date_transferred = date_transferred;
    account_data.skills_earned = skills_earned;
    account_data.description = description;
    account_data.rating = rating;
    account_data.behaviour = behaviour;
    account_data.created_at = created_at;
    account_data.is_initialized = true;

    msg!("Serializing state account");
    account_data.serialize(&mut &mut pda_account.data.borrow_mut()[..])?;
    msg!("State account serialized");

    Ok(())
}

pub fn update_review(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    from_institution: String,
    from_state_province: String,
    from_country: String,
    to_institution: String,
    to_country: String,
    date_started: String,
    date_ended: String,
    ending_salary: u64,
    ending_currency: String,
    new_salary: u64,
    new_currency: String,
    date_transferred: String,
    skills_earned: Vec<String>,
    description: String,
    rating: u8,
    behaviour: String,
    created_at: String,
) -> ProgramResult {
    msg!("Updating review...");

    let account_info_iter = &mut accounts.iter();
    let initializer = next_account_info(account_info_iter)?;
    let pda_account = next_account_info(account_info_iter)?;

    if pda_account.owner != program_id {
        return Err(ProgramError::IllegalOwner);
    }
    if !initializer.is_signer {
        msg!("Missing required signature");
        return Err(ProgramError::MissingRequiredSignature);
    }

    msg!("Unpacking state account");
    let mut account_data =
        try_from_slice_unchecked::<AccountState>(&pda_account.data.borrow()).unwrap();

    // Recompute the PDA using the original from_institution seed stored in the account
    let seed_data = account_data.from_institution.as_bytes();
    let (pda, _bump_seed) =
        Pubkey::find_program_address(&[initializer.key.as_ref(), seed_data], program_id);
    if pda != *pda_account.key {
        msg!("Invalid seeds for PDA");
        return Err(ReviewError::InvalidPDA.into());
    }

    msg!("Checking if account is initialized");
    if !account_data.is_initialized() {
        msg!("Account is not initialized");
        return Err(ReviewError::UninitializedAccount.into());
    }

    if rating > 10 || rating < 1 {
        return Err(ReviewError::InvalidRating.into());
    }

    msg!("Review before update:");
    msg!("From Institution: {}", account_data.from_institution);
    msg!("Rating: {}", account_data.rating);
    msg!("Description: {}", account_data.description);
    msg!("Behaviour: {}", account_data.behaviour);

    account_data.from_institution = from_institution;
    account_data.from_state_province = from_state_province;
    account_data.from_country = from_country;
    account_data.to_institution = to_institution;
    account_data.to_country = to_country;
    account_data.date_started = date_started;
    account_data.date_ended = date_ended;
    account_data.ending_salary = ending_salary;
    account_data.ending_currency = ending_currency;
    account_data.new_salary = new_salary;
    account_data.new_currency = new_currency;
    account_data.date_transferred = date_transferred;
    account_data.skills_earned = skills_earned;
    account_data.description = description;
    account_data.rating = rating;
    account_data.behaviour = behaviour;
    account_data.created_at = created_at;

    msg!("Review after update:");
    msg!("From Institution: {}", account_data.from_institution);
    msg!("Rating: {}", account_data.rating);
    msg!("Description: {}", account_data.description);
    msg!("Behaviour: {}", account_data.behaviour);

    msg!("Serializing state account");
    account_data.serialize(&mut &mut pda_account.data.borrow_mut()[..])?;
    msg!("State account serialized");

    Ok(())
}

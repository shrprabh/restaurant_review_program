use borsh::BorshDeserialize;
use solana_program::program_error::ProgramError;

pub enum ReviewInstruction {
    AddReview {
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
    },
    UpdateReview {
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
    },
}

#[derive(BorshDeserialize)]
struct ReviewPayload {
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
}

impl ReviewInstruction {
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        let (&variant, rest) = input
            .split_first()
            .ok_or(ProgramError::InvalidInstructionData)?;
        let payload = ReviewPayload::try_from_slice(rest)
            .map_err(|_| ProgramError::InvalidInstructionData)?;
        Ok(match variant {
            0 => Self::AddReview {
                from_institution: payload.from_institution,
                from_state_province: payload.from_state_province,
                from_country: payload.from_country,
                to_institution: payload.to_institution,
                to_country: payload.to_country,
                date_started: payload.date_started,
                date_ended: payload.date_ended,
                ending_salary: payload.ending_salary,
                ending_currency: payload.ending_currency,
                new_salary: payload.new_salary,
                new_currency: payload.new_currency,
                date_transferred: payload.date_transferred,
                skills_earned: payload.skills_earned,
                description: payload.description,
                rating: payload.rating,
                behaviour: payload.behaviour,
                created_at: payload.created_at,
            },
            1 => Self::UpdateReview {
                from_institution: payload.from_institution,
                from_state_province: payload.from_state_province,
                from_country: payload.from_country,
                to_institution: payload.to_institution,
                to_country: payload.to_country,
                date_started: payload.date_started,
                date_ended: payload.date_ended,
                ending_salary: payload.ending_salary,
                ending_currency: payload.ending_currency,
                new_salary: payload.new_salary,
                new_currency: payload.new_currency,
                date_transferred: payload.date_transferred,
                skills_earned: payload.skills_earned,
                description: payload.description,
                rating: payload.rating,
                behaviour: payload.behaviour,
                created_at: payload.created_at,
            },
            _ => return Err(ProgramError::InvalidInstructionData),
        })
    }
}

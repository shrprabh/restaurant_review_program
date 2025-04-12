import { Review } from "@/models/Review";
import React, { FC } from "react";

interface CardProps {
  review: Review;
}

const ReviewCard: FC<CardProps> = ({ review }) => {
  const {
    fromInstitution,
    fromStateProvince,
    fromCountry,
    toInstitution,
    toCountry,
    dateStarted,
    dateEnded,
    endingSalary,
    endingCurrency,
    newSalary,
    newCurrency,
    dateTransferred,
    skillsEarned,
    description,
    rating,
    behaviour,
    createdAt,
  } = review;

  return (
    <div className="relative group rounded-lg border border-transparent px-5 py-4 transition-colors border-gray-300 bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800/30 m-4">
      <h2 className="mb-3 text-2xl font-semibold">
        {fromInstitution.toUpperCase()} → {toInstitution.toUpperCase()}
      </h2>
      <p className="m-0 max-w-[30ch] text-sm opacity-80">{description}</p>
      <p className="m-0 max-w-[30ch] text-sm opacity-40">
        {`From ${fromCountry} (${fromStateProvince}) to ${toCountry}`}
      </p>
      <p className="mt-2 max-w-[30ch] text-sm opacity-75">
        {`Date: ${dateStarted} - ${dateEnded}`}
      </p>
      <p className="mt-2 max-w-[30ch] text-sm opacity-75">
        {`Ending Salary: ${endingSalary} ${endingCurrency} | New Salary: ${newSalary} ${newCurrency}`}
      </p>
      <p className="mt-2 max-w-[30ch] text-sm opacity-75">{`Rating: ${rating}/10`}</p>
      <p className="mt-2 max-w-[30ch] text-sm opacity-75">{`Behaviour: ${behaviour}`}</p>
      <p className="mt-2 max-w-[30ch] text-xs opacity-60">
        {`Skills: ${skillsEarned.join(", ")}`}
      </p>
      <p className="mt-2 max-w-[30ch] text-xs opacity-60">{`Transferred on: ${dateTransferred}`}</p>
      <p className="mt-2 max-w-[30ch] text-xs opacity-60">{`Created at: ${createdAt}`}</p>
    </div>
  );
};

export default ReviewCard;

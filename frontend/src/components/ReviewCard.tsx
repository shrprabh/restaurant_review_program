import { Review } from "@/models/Review";
import React, { FC, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

// Icons
const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg
    className={`w-5 h-5 ${filled ? "text-yellow-400" : "text-gray-300"}`}
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path>
  </svg>
);

const ArrowRightIcon = () => (
  <svg
    className="w-5 h-5 text-blue-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M14 5l7 7m0 0l-7 7m7-7H3"
    ></path>
  </svg>
);

const CalendarIcon = () => (
  <svg
    className="w-4 h-4 text-gray-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    ></path>
  </svg>
);

const MoneyIcon = () => (
  <svg
    className="w-4 h-4 text-gray-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    ></path>
  </svg>
);

const LocationIcon = () => (
  <svg
    className="w-4 h-4 text-gray-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    ></path>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    ></path>
  </svg>
);

const TagIcon = () => (
  <svg
    className="w-4 h-4 text-gray-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
    ></path>
  </svg>
);

interface CardProps {
  review: Review;
}

const ReviewCard: FC<CardProps> = ({ review }) => {
  const [expanded, setExpanded] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

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

  // Format dates if they are valid
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch {
      return dateString;
    }
  };

  // Calculate salary increase percentage
  const calculateSalaryChange = () => {
    if (!endingSalary || !newSalary) return { percentage: 0, isIncrease: true };

    const change = ((newSalary - endingSalary) / endingSalary) * 100;
    return {
      percentage: Math.abs(Math.round(change * 10) / 10),
      isIncrease: change >= 0,
    };
  };

  const salaryChange = calculateSalaryChange();

  // Generate rating stars
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 10; i++) {
      stars.push(<StarIcon key={i} filled={i <= rating} />);
    }
    return stars;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-3xl rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 m-4"
    >
      {/* Card Header */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
        <div className="absolute top-3 right-3 bg-white dark:bg-gray-900 text-blue-600 font-bold rounded-full px-3 py-1 text-sm">
          {rating}/10
        </div>

        <div className="flex items-center space-x-4 mb-2">
          <div className="flex-1">
            <h2 className="text-2xl font-bold tracking-tight">
              {fromInstitution}
            </h2>
            <div className="flex items-center text-blue-200 mt-1">
              <LocationIcon />
              <span className="ml-1 text-sm">
                {fromCountry} {fromStateProvince && `(${fromStateProvince})`}
              </span>
            </div>
          </div>

          <div className="flex items-center">
            <ArrowRightIcon />
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold tracking-tight">
              {toInstitution}
            </h2>
            <div className="flex items-center text-blue-200 mt-1">
              <LocationIcon />
              <span className="ml-1 text-sm">{toCountry}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-4 pt-4 border-t border-blue-400 text-sm">
          <div className="flex items-center">
            <CalendarIcon />
            <span className="ml-1">
              {formatDate(dateStarted)} - {formatDate(dateEnded)}
            </span>
          </div>
          <div className="flex items-center">
            <span className="font-medium">Transfer date:</span>
            <span className="ml-1">{formatDate(dateTransferred)}</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6">
        <div className="flex justify-between mb-4 pb-4 border-b dark:border-gray-700">
          <div>
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              Previous Salary
            </span>
            <div className="font-bold text-gray-800 dark:text-white">
              {endingSalary.toLocaleString()} {endingCurrency}
            </div>
          </div>

          <div className="flex items-center px-3">
            <div
              className={`text-${
                salaryChange.isIncrease ? "green" : "red"
              }-500 font-medium`}
            >
              {salaryChange.isIncrease ? "+" : "-"}
              {salaryChange.percentage}%
            </div>
          </div>

          <div>
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              New Salary
            </span>
            <div className="font-bold text-gray-800 dark:text-white">
              {newSalary.toLocaleString()} {newCurrency}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-700 dark:text-gray-300 text-base mb-4">
          {description.length > 150 && !expanded
            ? `${description.substring(0, 150)}...`
            : description}
          {description.length > 150 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="ml-1 text-blue-500 hover:text-blue-700 font-medium text-sm"
            >
              {expanded ? "Read less" : "Read more"}
            </button>
          )}
        </p>

        {/* Skills */}
        <div className="mb-4">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2 flex items-center">
            <TagIcon />
            <span className="ml-1 font-medium">Skills Earned</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {skillsEarned.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              >
                {skill.trim()}
              </span>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div className="mb-4">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center">
            <span className="font-medium mr-2">Overall Rating</span>
          </div>
          <div className="flex">{renderStars()}</div>
        </div>

        {/* Toggle Details */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-center py-2 border-t dark:border-gray-700 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 mt-2 focus:outline-none"
        >
          <span>{showDetails ? "Hide details" : "Show details"}</span>
          <svg
            className={`w-4 h-4 ml-1 transform transition-transform ${
              showDetails ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </button>

        {/* Details Section */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t dark:border-gray-700 pt-4 mt-2 overflow-hidden"
            >
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                Behaviour
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
                {behaviour || "No behaviour description provided."}
              </p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">
                    Date Started
                  </span>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatDate(dateStarted)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">
                    Date Ended
                  </span>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatDate(dateEnded)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">
                    Date Transferred
                  </span>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatDate(dateTransferred)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">
                    Created At
                  </span>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatDate(createdAt)}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ReviewCard;

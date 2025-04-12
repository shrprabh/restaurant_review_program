import { FC } from "react";

interface FormProps {
  fromInstitution: string;
  fromStateProvince: string;
  fromCountry: string;
  toInstitution: string;
  toCountry: string;
  dateStarted: string;
  dateEnded: string;
  endingSalary: number;
  endingCurrency: string;
  newSalary: number;
  newCurrency: string;
  dateTransferred: string;
  skillsEarned: string; // comma separated; will be split into an array
  description: string;
  rating: number;
  behaviour: string;
  createdAt: string;
  setFromInstitution: (value: string) => void;
  setFromStateProvince: (value: string) => void;
  setFromCountry: (value: string) => void;
  setToInstitution: (value: string) => void;
  setToCountry: (value: string) => void;
  setDateStarted: (value: string) => void;
  setDateEnded: (value: string) => void;
  setEndingSalary: (value: number) => void;
  setEndingCurrency: (value: string) => void;
  setNewSalary: (value: number) => void;
  setNewCurrency: (value: string) => void;
  setDateTransferred: (value: string) => void;
  setSkillsEarned: (value: string) => void;
  setDescription: (value: string) => void;
  setRating: (value: number) => void;
  setBehaviour: (value: string) => void;
  setCreatedAt: (value: string) => void;
  handleSubmit: () => void;
}

const ReviewForm: FC<FormProps> = ({
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
  setFromInstitution,
  setFromStateProvince,
  setFromCountry,
  setToInstitution,
  setToCountry,
  setDateStarted,
  setDateEnded,
  setEndingSalary,
  setEndingCurrency,
  setNewSalary,
  setNewCurrency,
  setDateTransferred,
  setSkillsEarned,
  setDescription,
  setRating,
  setBehaviour,
  setCreatedAt,
  handleSubmit,
}) => {
  // Static records for institutions, countries, and currencies
  const institutions = [
    "Harvard University",
    "Stanford University",
    "MIT",
    "University of Oxford",
    "University of Cambridge",
    "Other",
  ];

  const countries = [
    "United States",
    "Canada",
    "United Kingdom",
    "Australia",
    "Germany",
    "Other",
  ];

  const currencies = ["USD", "CAD", "GBP", "AUD", "EUR", "Other"];

  const formSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (rating < 0 || rating > 10) {
      alert("Rating must be between 0 and 10.");
      return;
    }
    handleSubmit();
  };

  return (
    <form
      onSubmit={formSubmit}
      className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-6"
    >
      {/* From Institution */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">
          From Institution
        </label>
        <select
          value={fromInstitution}
          onChange={(e) => setFromInstitution(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
        >
          <option value="">Select institution</option>
          {institutions.map((inst) => (
            <option key={inst} value={inst}>
              {inst}
            </option>
          ))}
        </select>
      </div>
      {/* From State/Province */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">
          From State/Province
        </label>
        <input
          type="text"
          placeholder="Enter state or province"
          value={fromStateProvince}
          onChange={(e) => setFromStateProvince(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
        />
      </div>
      {/* From Country */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">
          From Country
        </label>
        <select
          value={fromCountry}
          onChange={(e) => setFromCountry(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
        >
          <option value="">Select country</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>
      {/* To Institution */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">
          To Institution
        </label>
        <select
          value={toInstitution}
          onChange={(e) => setToInstitution(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
        >
          <option value="">Select institution</option>
          {institutions.map((inst) => (
            <option key={inst} value={inst}>
              {inst}
            </option>
          ))}
        </select>
      </div>
      {/* To Country */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">
          To Country
        </label>
        <select
          value={toCountry}
          onChange={(e) => setToCountry(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
        >
          <option value="">Select country</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>
      {/* Date Started */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">
          Date Started
        </label>
        <input
          type="date"
          placeholder="Select start date"
          value={dateStarted}
          onChange={(e) => setDateStarted(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
        />
      </div>
      {/* Date Ended */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">
          Date Ended
        </label>
        <input
          type="date"
          placeholder="Select end date"
          value={dateEnded}
          onChange={(e) => setDateEnded(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
        />
      </div>
      {/* Ending Salary */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">
          Ending Salary
        </label>
        <input
          type="number"
          placeholder="Enter ending salary"
          value={endingSalary}
          onChange={(e) => setEndingSalary(Number(e.target.value))}
          className="w-full border border-gray-300 rounded p-2"
        />
      </div>
      {/* Ending Currency */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">
          Ending Currency
        </label>
        <select
          value={endingCurrency}
          onChange={(e) => setEndingCurrency(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
        >
          <option value="">Select currency</option>
          {currencies.map((cur) => (
            <option key={cur} value={cur}>
              {cur}
            </option>
          ))}
        </select>
      </div>
      {/* New Salary */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">
          New Salary
        </label>
        <input
          type="number"
          placeholder="Enter new salary"
          value={newSalary}
          onChange={(e) => setNewSalary(Number(e.target.value))}
          className="w-full border border-gray-300 rounded p-2"
        />
      </div>
      {/* New Currency */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">
          New Currency
        </label>
        <select
          value={newCurrency}
          onChange={(e) => setNewCurrency(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
        >
          <option value="">Select currency</option>
          {currencies.map((cur) => (
            <option key={cur} value={cur}>
              {cur}
            </option>
          ))}
        </select>
      </div>
      {/* Date Transferred */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">
          Date Transferred
        </label>
        <input
          type="date"
          placeholder="Select transfer date"
          value={dateTransferred}
          onChange={(e) => setDateTransferred(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
        />
      </div>
      {/* Skills Earned */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">
          Skills Earned (comma separated)
        </label>
        <input
          type="text"
          placeholder="e.g., JavaScript, Solana, Rust"
          value={skillsEarned}
          onChange={(e) => setSkillsEarned(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
        />
      </div>
      {/* Description */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">
          Description
        </label>
        <textarea
          placeholder="Enter detailed description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
          rows={3}
        />
      </div>
      {/* Rating */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Rating</label>
        <input
          type="number"
          placeholder="Enter rating (0-10)"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          min={0}
          max={10}
          className="w-full border border-gray-300 rounded p-2"
        />
      </div>
      {/* Behaviour */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">
          Behaviour
        </label>
        <textarea
          placeholder="Describe behaviour or performance"
          value={behaviour}
          onChange={(e) => setBehaviour(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
          rows={2}
        />
      </div>
      {/* Created At */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">
          Created At
        </label>
        <input
          type="datetime-local"
          placeholder="Select creation date and time"
          value={createdAt}
          onChange={(e) => setCreatedAt(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
        />
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Submit Review
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;

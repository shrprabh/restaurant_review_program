import { FC, useState, useEffect } from "react";
import { motion } from "framer-motion";

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

interface FormSection {
  title: string;
  fields: {
    id: string;
    label: string;
    type: string;
    value: any;
    setter: (value: any) => void;
    options?: string[];
    placeholder?: string;
    min?: number;
    max?: number;
    rows?: number;
    required?: boolean;
  }[];
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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState(0);

  // Static records for institutions, countries, and currencies
  const institutions = [
    "Harvard University",
    "Stanford University",
    "MIT",
    "University of Oxford",
    "University of Cambridge",
    "Yale University",
    "Princeton University",
    "Columbia University",
    "Caltech",
    "University of Chicago",
    "Other",
  ];

  const countries = [
    "United States",
    "Canada",
    "United Kingdom",
    "Australia",
    "Germany",
    "France",
    "Japan",
    "China",
    "India",
    "Brazil",
    "Singapore",
    "Switzerland",
    "Other",
  ];

  const currencies = ["USD", "CAD", "GBP", "AUD", "EUR", "JPY", "CNY", "SGD", "CHF", "INR", "Other"];

  // Form validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!fromInstitution) newErrors.fromInstitution = "From Institution is required";
    if (!fromCountry) newErrors.fromCountry = "From Country is required";
    if (!toInstitution) newErrors.toInstitution = "To Institution is required";
    if (!toCountry) newErrors.toCountry = "To Country is required";
    if (!dateStarted) newErrors.dateStarted = "Start date is required";
    if (!dateEnded) newErrors.dateEnded = "End date is required";
    if (dateStarted && dateEnded && new Date(dateStarted) > new Date(dateEnded)) {
      newErrors.dateEnded = "End date must be after start date";
    }
    if (endingSalary < 0) newErrors.endingSalary = "Salary cannot be negative";
    if (newSalary < 0) newErrors.newSalary = "Salary cannot be negative";
    if (!endingCurrency) newErrors.endingCurrency = "Ending currency is required";
    if (!newCurrency) newErrors.newCurrency = "New currency is required";
    if (!description) newErrors.description = "Description is required";
    if (rating < 0 || rating > 10) newErrors.rating = "Rating must be between 0 and 10";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form sections organization
  const formSections: FormSection[] = [
    {
      title: "Previous Position",
      fields: [
        {
          id: "fromInstitution",
          label: "Institution",
          type: "select",
          value: fromInstitution,
          setter: setFromInstitution,
          options: institutions,
          required: true,
        },
        {
          id: "fromStateProvince",
          label: "State/Province",
          type: "text",
          value: fromStateProvince,
          setter: setFromStateProvince,
          placeholder: "Enter state or province",
        },
        {
          id: "fromCountry",
          label: "Country",
          type: "select",
          value: fromCountry,
          setter: setFromCountry,
          options: countries,
          required: true,
        },
        {
          id: "dateStarted",
          label: "Start Date",
          type: "date",
          value: dateStarted,
          setter: setDateStarted,
          required: true,
        },
        {
          id: "dateEnded",
          label: "End Date",
          type: "date",
          value: dateEnded,
          setter: setDateEnded,
          required: true,
        },
        {
          id: "endingSalary",
          label: "Ending Salary",
          type: "number",
          value: endingSalary,
          setter: setEndingSalary,
          placeholder: "Enter ending salary",
          min: 0,
        },
        {
          id: "endingCurrency",
          label: "Currency",
          type: "select",
          value: endingCurrency,
          setter: setEndingCurrency,
          options: currencies,
          required: true,
        },
      ],
    },
    {
      title: "New Position",
      fields: [
        {
          id: "toInstitution",
          label: "Institution",
          type: "select",
          value: toInstitution,
          setter: setToInstitution,
          options: institutions,
          required: true,
        },
        {
          id: "toCountry",
          label: "Country",
          type: "select",
          value: toCountry,
          setter: setToCountry,
          options: countries,
          required: true,
        },
        {
          id: "newSalary",
          label: "New Salary",
          type: "number",
          value: newSalary,
          setter: setNewSalary,
          placeholder: "Enter new salary",
          min: 0,
        },
        {
          id: "newCurrency",
          label: "Currency",
          type: "select",
          value: newCurrency,
          setter: setNewCurrency,
          options: currencies,
          required: true,
        },
        {
          id: "dateTransferred",
          label: "Transfer Date",
          type: "date",
          value: dateTransferred,
          setter: setDateTransferred,
        },
      ],
    },
    {
      title: "Review Details",
      fields: [
        {
          id: "skillsEarned",
          label: "Skills Earned",
          type: "text",
          value: skillsEarned,
          setter: setSkillsEarned,
          placeholder: "e.g., JavaScript, Solana, Rust (comma separated)",
        },
        {
          id: "description",
          label: "Description",
          type: "textarea",
          value: description,
          setter: setDescription,
          placeholder: "Enter detailed description about your experience",
          rows: 3,
          required: true,
        },
        {
          id: "rating",
          label: "Rating (0-10)",
          type: "number",
          value: rating,
          setter: setRating,
          min: 0,
          max: 10,
          required: true,
        },
        {
          id: "behaviour",
          label: "Behaviour",
          type: "textarea",
          value: behaviour,
          setter: setBehaviour,
          placeholder: "Describe behaviour or performance",
          rows: 2,
        },
        {
          id: "createdAt",
          label: "Date",
          type: "datetime-local",
          value: createdAt,
          setter: setCreatedAt,
        },
      ],
    },
  ];

  // Initialize createdAt if empty
  useEffect(() => {
    if (!createdAt) {
      const now = new Date();
      const isoString = new Date(
        now.getTime() - now.getTimezoneOffset() * 60000
      ).toISOString().slice(0, 16);
      setCreatedAt(isoString);
    }
  }, [createdAt, setCreatedAt]);

  // Form submission handler
  const formSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await handleSubmit();
        // Success message could be added here
      } catch (error) {
        console.error("Error submitting form:", error);
        // Error message could be added here
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Find the first section with errors and activate it
      for (let i = 0; i < formSections.length; i++) {
        const section = formSections[i];
        const hasErrors = section.fields.some(field => errors[field.id]);
        if (hasErrors) {
          setActiveSection(i);
          break;
        }
      }
    }
  };

  // Field renderer based on type
  const renderField = (field: FormSection["fields"][0]) => {
    const hasError = !!errors[field.id];
    const baseClasses = "w-full border rounded p-3 transition-all focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50";
    const classes = hasError
      ? `${baseClasses} border-red-500 bg-red-50`
      : `${baseClasses} border-gray-300`;

    switch (field.type) {
      case "select":
        return (
          <div className="space-y-1">
            <label htmlFor={field.id} className="block text-gray-700 font-medium">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <select
              id={field.id}
              value={field.value}
              onChange={(e) => field.setter(e.target.value)}
              className={classes}
              required={field.required}
            >
              <option value="">Select {field.label.toLowerCase()}</option>
              {field.options?.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {hasError && <p className="text-red-500 text-sm mt-1">{errors[field.id]}</p>}
          </div>
        );

      case "textarea":
        return (
          <div className="space-y-1">
            <label htmlFor={field.id} className="block text-gray-700 font-medium">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <textarea
              id={field.id}
              value={field.value}
              onChange={(e) => field.setter(e.target.value)}
              placeholder={field.placeholder}
              className={classes}
              rows={field.rows || 3}
              required={field.required}
            />
            {hasError && <p className="text-red-500 text-sm mt-1">{errors[field.id]}</p>}
          </div>
        );

      default:
        return (
          <div className="space-y-1">
            <label htmlFor={field.id} className="block text-gray-700 font-medium">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              id={field.id}
              type={field.type}
              value={field.value}
              onChange={(e) =>
                field.type === "number"
                  ? field.setter(Number(e.target.value))
                  : field.setter(e.target.value)
              }
              placeholder={field.placeholder}
              className={classes}
              min={field.min}
              max={field.max}
              required={field.required}
            />
            {hasError && <p className="text-red-500 text-sm mt-1">{errors[field.id]}</p>}
          </div>
        );
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1
      } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div 
        className="bg-white rounded-xl shadow-xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 text-white">
          <h1 className="text-3xl font-bold">Veritas Vitae</h1>
          <p className="opacity-80">Share your institutional experience</p>
        </div>

        <form onSubmit={formSubmit} className="px-8 py-6">
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              {formSections.map((section, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveSection(index)}
                  className={`flex flex-col items-center flex-1 ${
                    index < formSections.length - 1 ? "relative" : ""
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 z-10 ${
                      index <= activeSection
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-400 border-gray-300"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span
                    className={`mt-2 text-sm font-medium ${
                      index === activeSection ? "text-blue-600" : "text-gray-500"
                    }`}
                  >
                    {section.title}
                  </span>
                  {index < formSections.length - 1 && (
                    <div
                      className={`absolute h-0.5 top-5 left-1/2 w-full ${
                        index < activeSection ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    ></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Active form section */}
          <motion.div
            key={activeSection}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              {formSections[activeSection].title}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formSections[activeSection].fields.map((field) => (
                <motion.div key={field.id} variants={itemVariants}>
                  {renderField(field)}
                </motion.div>
              ))}
            </div>

            <div className="flex justify-between pt-8">
              {activeSection > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveSection(activeSection - 1)}
                  className="px-6 py-2.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
              )}
              
              {activeSection < formSections.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setActiveSection(activeSection + 1)}
                  className="ml-auto px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="ml-auto px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400 flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    "Submit Review"
                  )}
                </button>
              )}
            </div>
          </motion.div>
        </form>
      </motion.div>
      
      <p className="text-center text-gray-500 mt-4 text-sm">
        Veritas Vitae - Sharing experiences, building transparency
      </p>
    </div>
  );
};

export default ReviewForm;
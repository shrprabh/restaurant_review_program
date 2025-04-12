import { AppBar } from "@/components/AppBar";
import ReviewCard from "@/components/ReviewCard";
import { useEffect, useState } from "react";
import { Review } from "@/models/Review";
import * as web3 from "@solana/web3.js";
import { fetchReviews } from "@/util/fetchReviews";
import { useWallet } from "@solana/wallet-adapter-react";
import ReviewForm from "@/components/Form";
import { motion } from "framer-motion";
import Head from "next/head";

// Replace with your own Program_id
const REVIEW_PROGRAM_ID = "2VAnFzCVr6B72HAnPYGkfsyJfWSABJGXwT5hNR8CFKdz";

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const connection = new web3.Connection(web3.clusterApiUrl("devnet"));
  const { publicKey, sendTransaction } = useWallet();

  const [txid, setTxid] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  // Extended state fields
  const [fromInstitution, setFromInstitution] = useState("");
  const [fromStateProvince, setFromStateProvince] = useState("");
  const [fromCountry, setFromCountry] = useState("");
  const [toInstitution, setToInstitution] = useState("");
  const [toCountry, setToCountry] = useState("");
  const [dateStarted, setDateStarted] = useState("");
  const [dateEnded, setDateEnded] = useState("");
  const [endingSalary, setEndingSalary] = useState(0);
  const [endingCurrency, setEndingCurrency] = useState("");
  const [newSalary, setNewSalary] = useState(0);
  const [newCurrency, setNewCurrency] = useState("");
  const [dateTransferred, setDateTransferred] = useState("");
  const [skillsEarned, setSkillsEarned] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(0);
  const [behaviour, setBehaviour] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const fetchAccounts = async () => {
      try {
        const fetchedReviews = await fetchReviews(
          REVIEW_PROGRAM_ID,
          connection
        );
        setReviews(fetchedReviews || []);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchAccounts();
  }, []);

  const handleSubmit = () => {
    // Convert skillsEarned from comma-separated string to an array
    const skillsArray = skillsEarned
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const review = new Review(
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
      skillsArray,
      description,
      rating,
      behaviour,
      createdAt
    );
    handleTransactionSubmit(review);
  };

  const handleTransactionSubmit = async (review: Review) => {
    if (!publicKey) {
      alert("Please connect your wallet!");
      return;
    }

    try {
      const buffer = review.serialize();
      const transaction = new web3.Transaction();

      const [pda] = await web3.PublicKey.findProgramAddressSync(
        [publicKey.toBuffer(), Buffer.from(review.fromInstitution)],
        new web3.PublicKey(REVIEW_PROGRAM_ID)
      );

      const instruction = new web3.TransactionInstruction({
        keys: [
          {
            pubkey: publicKey,
            isSigner: true,
            isWritable: false,
          },
          {
            pubkey: pda,
            isSigner: false,
            isWritable: true,
          },
          {
            pubkey: web3.SystemProgram.programId,
            isSigner: false,
            isWritable: false,
          },
        ],
        data: buffer,
        programId: new web3.PublicKey(REVIEW_PROGRAM_ID),
      });

      transaction.add(instruction);

      const tx = await sendTransaction(transaction, connection);
      setTxid(
        `Transaction submitted: https://explorer.solana.com/tx/${tx}?cluster=devnet`
      );
      setShowSuccess(true);

      // Add the new review to the reviews list
      setReviews((prevReviews) => [...prevReviews, review]);

      // Reset the form
      setTimeout(() => {
        setShowForm(false);
        setActiveSection("reviews");
      }, 3000);
    } catch (e) {
      console.error(e);
      alert(
        "Error submitting transaction: " +
          (e instanceof Error ? e.message : JSON.stringify(e))
      );
    }
  };

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setActiveSection(sectionId);
    }
  };

  return (
    <>
      <Head>
        <title>Veritas Vitae | Institutional Transparency on Blockchain</title>
        <meta
          name="description"
          content="Veritas Vitae - Truth of Life - A blockchain solution for institutional transparency and career tracking"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        {/* Navigation Bar */}
        <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-md z-50 backdrop-blur-md bg-opacity-80 dark:bg-opacity-80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                  Veritas Vitae
                </div>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <button
                    onClick={() => scrollToSection("home")}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      activeSection === "home"
                        ? "bg-blue-600 text-white"
                        : "text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    Home
                  </button>
                  <button
                    onClick={() => scrollToSection("about")}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      activeSection === "about"
                        ? "bg-blue-600 text-white"
                        : "text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    About
                  </button>
                  <button
                    onClick={() => scrollToSection("reviews")}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      activeSection === "reviews"
                        ? "bg-blue-600 text-white"
                        : "text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    Reviews
                  </button>
                  <button
                    onClick={() => {
                      setShowForm(!showForm);
                      scrollToSection("add-review");
                    }}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      activeSection === "add-review"
                        ? "bg-blue-600 text-white"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                    }`}
                  >
                    Add Review
                  </button>
                </div>
              </div>
              <div className="md:hidden">
                <AppBar />
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section id="home" className="pt-32 pb-20 md:pt-40 md:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          >
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="mb-8"
              >
                <div className="relative inline-block">
                  <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-blue-600/30 to-indigo-600/30 rounded-full"></div>
                  <div className="relative">
                    <svg
                      className="h-20 w-20 md:h-28 md:w-28 mx-auto"
                      viewBox="0 0 100 100"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="48"
                        stroke="url(#paint0_linear)"
                        strokeWidth="4"
                      />
                      <path
                        d="M30 50L45 65L70 35"
                        stroke="url(#paint1_linear)"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear"
                          x1="10"
                          y1="10"
                          x2="90"
                          y2="90"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#3B82F6" />
                          <stop offset="1" stopColor="#4F46E5" />
                        </linearGradient>
                        <linearGradient
                          id="paint1_linear"
                          x1="30"
                          y1="50"
                          x2="70"
                          y2="50"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#3B82F6" />
                          <stop offset="1" stopColor="#4F46E5" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl"
              >
                <span className="block">Veritas Vitae</span>
                <span className="block text-blue-600">Truth of Life</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl"
              >
                A blockchain solution for institutional transparency. Share your
                experiences and discover the truth about institutional
                transitions and career paths.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="mt-8 max-w-md mx-auto sm:flex sm:justify-center md:mt-8"
              >
                <div className="rounded-md shadow">
                  <button
                    onClick={() => {
                      setShowForm(true);
                      scrollToSection("add-review");
                    }}
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                  >
                    Add Your Review
                  </button>
                </div>
                <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                  <button
                    onClick={() => scrollToSection("reviews")}
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                  >
                    View Reviews
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* About Section */}
        <section id="about" className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:text-center"
            >
              <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">
                About The Project
              </h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Untapped Potential: Blockchain for Real-World Problems
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 lg:mx-auto">
                Exploring blockchain solutions beyond cryptocurrencies to
                address significant real-world challenges.
              </p>
            </motion.div>

            <div className="mt-10">
              <motion.dl
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ staggerChildren: 0.1, delayChildren: 0.3 }}
                className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      Decentralized Identity
                    </p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500 dark:text-gray-400">
                    Empowering individuals with self-sovereign identity
                    management, giving users control over their personal data.
                  </dd>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                        />
                      </svg>
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      Transparent Supply Chains
                    </p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500 dark:text-gray-400">
                    Building consumer trust through immutable records of product
                    journeys from origin to consumer.
                  </dd>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      Intellectual Property Protection
                    </p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500 dark:text-gray-400">
                    Enabling fair rewards for digital creators through
                    verifiable ownership and automated licensing.
                  </dd>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      Community Governance
                    </p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500 dark:text-gray-400">
                    Fostering participation and trust through Decentralized
                    Autonomous Organizations (DAOs).
                  </dd>
                </motion.div>
              </motion.dl>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section id="reviews" className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:text-center mb-12"
            >
              <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">
                Institutional Reviews
              </h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Discover Shared Experiences
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 lg:mx-auto">
                Explore honest reviews from professionals who've made
                institutional transitions, verified and secured on the
                blockchain.
              </p>
            </motion.div>

            {reviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {reviews.map((review, index) => (
                  <motion.div
                    key={`${review.fromInstitution}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <ReviewCard review={review} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                    d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                  No reviews yet
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Be the first to add a review about an institution.
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => {
                      setShowForm(true);
                      scrollToSection("add-review");
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Add Review
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* Add Review Section */}
        <section id="add-review" className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:text-center mb-12"
            >
              <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">
                Add Your Voice
              </h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Share Your Institutional Experience
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 lg:mx-auto">
                Your insights help others make informed decisions about their
                career paths and institutional choices.
              </p>
            </motion.div>

            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-8 bg-green-50 dark:bg-green-900 p-4 rounded-lg shadow-sm"
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-green-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                      Review submitted successfully!
                    </h3>
                    <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                      <p>
                        Your review has been stored on the blockchain and is now
                        publicly viewable.
                      </p>
                    </div>
                    <div className="mt-2">
                      <a
                        href={txid.split(": ")[1]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-green-800 dark:text-green-200 underline hover:text-green-700"
                      >
                        View transaction details
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: showForm ? 1 : 0,
                height: showForm ? "auto" : 0,
              }}
              transition={{ duration: 0.5 }}
              className="overflow-hidden"
            >
              <ReviewForm
                fromInstitution={fromInstitution}
                fromStateProvince={fromStateProvince}
                fromCountry={fromCountry}
                toInstitution={toInstitution}
                toCountry={toCountry}
                dateStarted={dateStarted}
                dateEnded={dateEnded}
                endingSalary={endingSalary}
                endingCurrency={endingCurrency}
                newSalary={newSalary}
                newCurrency={newCurrency}
                dateTransferred={dateTransferred}
                skillsEarned={skillsEarned}
                description={description}
                rating={rating}
                behaviour={behaviour}
                createdAt={createdAt}
                setFromInstitution={setFromInstitution}
                setFromStateProvince={setFromStateProvince}
                setFromCountry={setFromCountry}
                setToInstitution={setToInstitution}
                setToCountry={setToCountry}
                setDateStarted={setDateStarted}
                setDateEnded={setDateEnded}
                setEndingSalary={setEndingSalary}
                setEndingCurrency={setEndingCurrency}
                setNewSalary={setNewSalary}
                setNewCurrency={setNewCurrency}
                setDateTransferred={setDateTransferred}
                setSkillsEarned={setSkillsEarned}
                setDescription={setDescription}
                setRating={setRating}
                setBehaviour={setBehaviour}
                setCreatedAt={setCreatedAt}
                handleSubmit={handleSubmit}
              />
            </motion.div>

            {!showForm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg
                    className="mr-2 -ml-1 h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Add a New Review
                </button>
              </motion.div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
            <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
              <p className="text-center text-base text-gray-400">
                <span className="block md:inline">
                  © 2025 Veritas Vitae. All rights reserved.
                </span>
                <span className="hidden md:inline"> | </span>
                <span className="block md:inline">
                  Built on Solana Blockchain for decentralized trust and
                  transparency
                </span>
              </p>

              <div className="mt-8 flex justify-center space-x-6">
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">GitHub</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Twitter</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">LinkedIn</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>

              <div className="mt-8">
                <p className="text-center text-sm text-gray-400">
                  <span className="font-bold text-blue-600">
                    Veritas Vitae:
                  </span>{" "}
                  Untapped Potential - Exploring Blockchain Solutions for
                  Real-World Problems
                </p>
                <p className="text-center text-xs text-gray-400 mt-2">
                  A transparent and immutable solution for institutional review
                  tracking, built on the Solana blockchain.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}

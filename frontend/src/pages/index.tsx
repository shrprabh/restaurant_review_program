import { AppBar } from "@/components/AppBar";
import ReviewCard from "@/components/ReviewCard";
import { useEffect, useState } from "react";
import { Review } from "@/models/Review";
import * as web3 from "@solana/web3.js";
import { fetchReviews } from "@/util/fetchReviews";
import { useWallet } from "@solana/wallet-adapter-react";
import ReviewForm from "@/components/Form";

// Replace with your own Program_id
const REVIEW_PROGRAM_ID = "2VAnFzCVr6B72HAnPYGkfsyJfWSABJGXwT5hNR8CFKdz";

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const connection = new web3.Connection(web3.clusterApiUrl("devnet"));
  const { publicKey, sendTransaction } = useWallet();

  const [txid, setTxid] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);

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

  useEffect(() => {
    setIsMounted(true);
    const fetchAccounts = async () => {
      await fetchReviews(REVIEW_PROGRAM_ID, connection).then(setReviews);
    };
    fetchAccounts();
  }, []);

  const handleSubmit = () => {
    // Convert skillsEarned from comma-separated string to an array
    const skillsArray = skillsEarned.split(",").map(s => s.trim()).filter(Boolean);
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

    try {
      const tx = await sendTransaction(transaction, connection);
      setTxid(`Transaction submitted: https://explorer.solana.com/tx/${tx}?cluster=devnet`);
    } catch (e) {
      console.error(e);
      alert(JSON.stringify(e));
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <AppBar />
      </div>
      <div className="my-8">
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
      </div>
      {txid && <div>{txid}</div>}
      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:grid-cols-3">
        {reviews.map((review) => (
          <ReviewCard key={review.fromInstitution} review={review} />
        ))}
      </div>
    </main>
  );
}

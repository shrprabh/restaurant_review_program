import * as web3 from "@solana/web3.js";
import { Review } from "@/models/Review";

export const fetchReviews = async (
  REVIEW_PROGRAM_ID: string,
  connection: web3.Connection
) => {
  const accounts = await connection.getProgramAccounts(
    new web3.PublicKey(REVIEW_PROGRAM_ID)
    // Optionally adjust filters or dataSlice if needed
  );

  const reviews = accounts.reduce((accum: Review[], account) => {
    const review = Review.deserialize(account.account.data);
    return review ? [...accum, review] : accum;
  }, []);

  return reviews;
};

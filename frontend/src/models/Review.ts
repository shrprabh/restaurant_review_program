import * as borsh from "@project-serum/borsh";
import BN from "bn.js";  // Add this import

export class Review {
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
  skillsEarned: string[];
  description: string;
  rating: number;
  behaviour: string;
  createdAt: string;

  constructor(
    fromInstitution: string,
    fromStateProvince: string,
    fromCountry: string,
    toInstitution: string,
    toCountry: string,
    dateStarted: string,
    dateEnded: string,
    endingSalary: number,
    endingCurrency: string,
    newSalary: number,
    newCurrency: string,
    dateTransferred: string,
    skillsEarned: string[],
    description: string,
    rating: number,
    behaviour: string,
    createdAt: string
  ) {
    this.fromInstitution = fromInstitution;
    this.fromStateProvince = fromStateProvince;
    this.fromCountry = fromCountry;
    this.toInstitution = toInstitution;
    this.toCountry = toCountry;
    this.dateStarted = dateStarted;
    this.dateEnded = dateEnded;
    this.endingSalary = endingSalary;
    this.endingCurrency = endingCurrency;
    this.newSalary = newSalary;
    this.newCurrency = newCurrency;
    this.dateTransferred = dateTransferred;
    this.skillsEarned = skillsEarned;
    this.description = description;
    this.rating = rating;
    this.behaviour = behaviour;
    this.createdAt = createdAt;
  }

  borshInstructionSchema = borsh.struct([
    borsh.u8("variant"),
    borsh.str("fromInstitution"),
    borsh.str("fromStateProvince"),
    borsh.str("fromCountry"),
    borsh.str("toInstitution"),
    borsh.str("toCountry"),
    borsh.str("dateStarted"),
    borsh.str("dateEnded"),
    borsh.u64("endingSalary"),
    borsh.str("endingCurrency"),
    borsh.u64("newSalary"),
    borsh.str("newCurrency"),
    borsh.str("dateTransferred"),
    borsh.vec(borsh.str(), "skillsEarned"),
    borsh.str("description"),
    borsh.u8("rating"),
    borsh.str("behaviour"),
    borsh.str("createdAt"),
  ]);

  static borshAccountSchema = borsh.struct([
    borsh.bool("initialized"),
    borsh.str("fromInstitution"),
    borsh.str("fromStateProvince"),
    borsh.str("fromCountry"),
    borsh.str("toInstitution"),
    borsh.str("toCountry"),
    borsh.str("dateStarted"),
    borsh.str("dateEnded"),
    borsh.u64("endingSalary"),
    borsh.str("endingCurrency"),
    borsh.u64("newSalary"),
    borsh.str("newCurrency"),
    borsh.str("dateTransferred"),
    borsh.vec(borsh.str(), "skillsEarned"),
    borsh.str("description"),
    borsh.u8("rating"),
    borsh.str("behaviour"),
    borsh.str("createdAt"),
  ]);

  serialize(): Buffer {
    const buffer = Buffer.alloc(1000);
    // Using variant 0 for AddReview
    this.borshInstructionSchema.encode({
        variant: 0,
        fromInstitution: this.fromInstitution,
        fromStateProvince: this.fromStateProvince,
        fromCountry: this.fromCountry,
        toInstitution: this.toInstitution,
        toCountry: this.toCountry,
        dateStarted: this.dateStarted,
        dateEnded: this.dateEnded,
        endingSalary: new BN(this.endingSalary),
        endingCurrency: this.endingCurrency,
        newSalary: new BN(this.newSalary),
        newCurrency: this.newCurrency,
        dateTransferred: this.dateTransferred,
        skillsEarned: this.skillsEarned,
        description: this.description,
        rating: this.rating,
        behaviour: this.behaviour,
        createdAt: this.createdAt
      }, buffer);
      return buffer.slice(0, this.borshInstructionSchema.getSpan(buffer));
    }

  static deserialize(buffer?: Buffer): Review | null {
    if (!buffer) return null;

    try {
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
      } = this.borshAccountSchema.decode(buffer);
      return new Review(
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
        createdAt
      );
    } catch (e) {
      console.log("Deserialization error:", e);
      console.log(buffer);
      return null;
    }
  }
}

import mongoose, { Types } from "mongoose";
import { Availability } from "./user";

export interface ChatDocument {
  userId: Types.ObjectId;
  userName: string;
  availability: Availability;
  created_at: Date;
}


const Schema = mongoose.Schema;
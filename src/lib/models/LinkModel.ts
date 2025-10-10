import mongoose, { Document, Model, Schema } from "mongoose";
import { Answer, Asker } from "./qModels";

export interface ILink extends Document {
  name: string;
  owner: Asker;
  questions: Answer[];
  isOpen: boolean;
  createdAt: Date;
  updatedAt: Date;
  _id: string;
}

const linkSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    owner: {
      id: { type: String, required: true },
      name: { type: String, required: true },
      email: { type: String, required: true },
      image: { type: String, required: false },
    },
    questions: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          default: () => new mongoose.Types.ObjectId(),
        },
        text: {
          type: String,
          required: true,
        },
        isAnonymous: { type: Boolean, default: false },
        respondent: {
          type: String,
        },
        replies: { type: Number, default: 0 },
        upVotes: [
          {
            type: Schema.Types.ObjectId,
            ref: "User",
          },
        ],
        downVotes: [
          {
            type: Schema.Types.ObjectId,
            ref: "User",
          },
        ],
        questionId: {
          type: Schema.Types.ObjectId,
          ref: "Question",
          required: true,
        },
        repliedTo: {
          type: Schema.Types.ObjectId,
          ref: "Answer",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    isOpen: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Link: Model<ILink> =
  mongoose.models.Link || mongoose.model<ILink>("Link", linkSchema);

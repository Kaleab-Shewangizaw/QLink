import mongoose, { Document, Model, Schema } from "mongoose";
import { Answer } from "./qModels";

export interface ILink extends Document {
  name: string;
  owner: string;
  questions: Answer[];
  isOpen: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const linkSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    owner: { type: String, required: true },
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
        respondant: {
          type: String,
        },
        replies: [
          {
            text: {
              type: String,
              required: true,
            },
            respondant: {
              type: String,
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
        likes: {
          type: Number,
          default: 0,
        },
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

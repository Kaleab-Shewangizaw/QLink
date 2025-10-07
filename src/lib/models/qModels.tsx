import { User } from "better-auth";
import mongoose, { Document, Model, Schema } from "mongoose";

export interface Answer {
  _id?: string;
  text: string;
  respondent?: User | string;
  upVotes: string[];
  downVotes: string[];
  images: string[];
  isReply: boolean;
  isAnonymous?: boolean;
  replies: number;
  questionId: string;
  repliedTo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IQuestion extends Document {
  id: string;
  title: string;
  isAnonymous: boolean;
  description?: string;
  asker: User | string;
  upVotes: string[];
  downVotes: string[];
  images: string[];
  answers?: Answer[];
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
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
    images: {
      type: [String],
      default: [],
    },

    asker: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    answers: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          default: () => new mongoose.Types.ObjectId(),
        },
        text: {
          type: String,
          required: true,
        },
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
  },
  { timestamps: true }
);

export const Question: Model<IQuestion> =
  mongoose.models.Question ||
  mongoose.model<IQuestion>("Question", QuestionSchema);

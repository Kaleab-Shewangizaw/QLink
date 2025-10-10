import mongoose, { Document, Model, Schema } from "mongoose";

export interface Answer {
  _id?: string;
  text: string;
  respondent?: Asker;
  upVotes: string[];
  downVotes: string[];
  images?: string[];
  isReply: boolean;
  isAnonymous?: boolean;
  replies: number;
  questionId: string;
  repliedTo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Asker {
  id: string;
  name: string;
  email: string;
  image: string;
}

export interface IQuestion extends Document {
  _id: string;
  title: string;
  isAnonymous: boolean;
  description?: string;
  asker: Asker;
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
      id: { type: String, required: true },
      name: { type: String, required: true },
      email: { type: String, required: true },
      image: { type: String, required: false },
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
          id: { type: String, required: false },
          name: { type: String, required: false },
          email: { type: String, required: false },
          image: { type: String, required: false },
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

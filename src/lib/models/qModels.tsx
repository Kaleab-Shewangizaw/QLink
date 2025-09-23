import mongoose, { Document, Model, Schema } from "mongoose";

interface Answer {
  text: string;
  respondent: string;
  likes: number;
  isReply: boolean;
  replies?: Answer[];
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
  asker: string;
  likes: number;
  answers?: Answer[];
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema = new Schema(
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
    likes: {
      type: Number,
      default: 0,
    },

    asker: {
      type: Schema.Types.ObjectId,
      ref: "User",
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
  },
  { timestamps: true }
);

export const Project: Model<IQuestion> =
  mongoose.models.Project ||
  mongoose.model<IQuestion>("Project", ProjectSchema);

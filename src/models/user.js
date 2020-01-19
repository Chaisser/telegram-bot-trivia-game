const mongoose = require("mongoose");

const AnswersSchema = new mongoose.Schema(
  {
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question"
    },
    answer: {
      type: String
    },
    earnings: {
      type: Number
    },
    isCorrect: {
      type: Boolean
    },
    isCurrent: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true
    },
    surname: {
      type: String,
      trim: true
    },
    username: {
      type: String,
      trim: true,
      required: true
    },
    telegramId: {
      type: String,
      required: true
    },
    isBot: {
      type: Boolean
    },
    languageCode: {
      type: String
    },
    answers: [AnswersSchema],
    wallet: {
      currency: {
        type: String,
        default: "Bitcoin"
      },
      address: {
        type: String
      }
    },
    status: {
      type: Number,
      default: 1
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;

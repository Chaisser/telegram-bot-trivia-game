const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    correctOption: {
      type: Number,
      required: true
    },
    options: [
      {
        title: {
          type: String,
          trim: true,
          required: true
        },
        value: {
          type: Number,
          required: true
        }
      }
    ],
    category: {
      type: String,
      required: true,
      trim: true
    },
    difficulty: {
      type: String
    },
    type: {
      type: String
    },
    language: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;

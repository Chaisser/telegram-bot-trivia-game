const Question = require("./../models/question");
const User = require("./../models/user");
const axios = require("axios");

const shuffle = array => {
  array.sort(() => Math.random() - 0.5);
};
const arraySearch = (arr, val) => {
  for (var i = 0; i < arr.length; i++) if (arr[i] === val) return i;
  return false;
};

const answerQuestion = async (userAnswer, telegramId) => {
  let user = await User.findOne({ telegramId });

  if (!user) {
    return { status: "noUser" };
  }

  if (user.answers.length === 0) {
    return { status: "noQuestion" };
  }

  const getCurrentQuestion = user.answers.find(
    answer => answer.isCurrent === true
  );
  if (!getCurrentQuestion) {
    return { status: "noQuestion" };
  }
  const question = await Question.findOne({ _id: getCurrentQuestion.question });
  if (!question) {
    return null;
  }

  const isReply = question.options.find(option => option.title === userAnswer);
  if (!isReply) {
    return { status: "noQuestion" };
  }
  const correctOption = question.correctOption - 1;
  if (question.options[correctOption].title === userAnswer) {
    const points = {
      hard: 5,
      medium: 3,
      easy: 1
    };

    const result = user.answers.id(getCurrentQuestion._id);
    result.answer = userAnswer;
    result.earnings = points[question.difficulty];
    result.isCurrent = false;
    result.isCorrect = true;
    await user.save();
    return { status: "correct", earnings: points[question.difficulty] };
  }

  const result = user.answers.id(getCurrentQuestion._id);
  result.answer = userAnswer;
  result.earnings = 0;
  result.isCurrent = false;
  result.isCorrect = false;
  await user.save();
  return { status: "wrong", earnings: 0 };
};

const getQuestion = async telegramId => {
  let user = await User.findOne({ telegramId });
  if (!user) {
    return null;
  }

  if (user.answers.length === 0) {
    const count = await Question.countDocuments();
    const random = Math.floor(Math.random() * count);
    const question = await Question.find({}).skip(random);
    user.answers = user.answers.concat({
      question: question[0].id,
      isCurrent: true
    });

    await user.save();
    return question;
  }

  const getCurrentQuestion = user.answers.find(
    answer => answer.isCurrent === true
  );
  if (getCurrentQuestion) {
    const question = await Question.find({
      _id: getCurrentQuestion.question
    });
    return question;
  }
  const count = await Question.countDocuments();
  const random = Math.floor(Math.random() * count);
  const question = await Question.find({}).skip(random);
  user.answers = user.answers.concat({
    question: question[0].id,
    isCurrent: true
  });

  await user.save();
  return question;
};

const addQuestion = async () => {
  const url = `https://opentdb.com/api.php?amount=1`;
  try {
    const questionData = await axios.get(url);
    const checkQuestion = await Question.findOne({
      title: questionData.data.results[0].question
    });
    if (checkQuestion) {
      return false;
    }

    const {
      question,
      category,
      difficulty,
      correct_answer,
      incorrect_answers,
      type
    } = questionData.data.results[0];

    incorrect_answers.push(correct_answer);
    shuffle(incorrect_answers);
    const options = [];
    let v = 1;
    incorrect_answers.map(option => {
      options.push({ title: option, value: v });
      v = v + 1;
    });
    const result = {
      category,
      title: question,
      difficulty,
      type,
      options,
      correctOption: arraySearch(incorrect_answers, correct_answer) + 1,
      language: "en"
    };

    const saveQuestion = new Question(result);
    await saveQuestion.save();
    return true;
  } catch (err) {
    console.log(err);
  }

  return user;
};

module.exports = { addQuestion, getQuestion, answerQuestion };

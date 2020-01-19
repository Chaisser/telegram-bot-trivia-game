const User = require("./../models/user");

const getUser = async telegramId => {
  const user = await User.findOne({ telegramId });
  if (!user) {
    return null;
  }

  return user;
};

const addUser = async (
  telegramId,
  isBot,
  name,
  surname,
  username,
  languageCode
) => {
  try {
    const user = new User({
      telegramId,
      isBot,
      name,
      surname,
      username,
      languageCode
    });
    await user.save();
  } catch (err) {
    console.log(err);
  }
};

const getStatus = telegramId => {
  return User.aggregate([
    { $match: { telegramId: telegramId.toString() } },
    { $unwind: "$answers" },
    {
      $group: {
        _id: "$_id",
        points: { $sum: "$answers.earnings" },
        answeredQuestionsTotal: { $sum: 1 }
      }
    }
  ]);
};

module.exports = { getUser, addUser, getStatus };

const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();
require("./src/db/mongoose");
const Entities = require("html-entities").XmlEntities;
const entities = new Entities();
const { getUser, addUser, getStatus } = require("./src/actions/user");
const {
  addQuestion,
  getQuestion,
  answerQuestion
} = require("./src/actions/question");
const token = process.env.TELEGRAM_TOKEN;
let bot;

if (process.env.NODE_ENV === "production") {
  bot = new TelegramBot(token);
  bot.setWebHook(process.env.HEROKU_URL + bot.token);
} else {
  bot = new TelegramBot(token, { polling: true });
}

bot.on("message", async (msg, match) => {
  const result = await answerQuestion(msg.text, msg.chat.id);
  if (result.status === "correct") {
    bot.sendMessage(
      msg.chat.id,
      `Wonderful you got ${result.earnings} point(s). Type /status to view your total points`
    );
  } else if (result.status === "wrong") {
    bot.sendMessage(
      msg.chat.id,
      `Wrong answer! Get another /question to earn some points`
    );
  }
});

bot.onText(/\/question/, async (msg, match) => {
  const question = await getQuestion(msg.chat.id);

  if (!question) {
    bot.sendMessage(msg.chat.id, "Please try again");
  }
  let keyboard = [];

  question[0].options.map(option => {
    keyboard.push([{ text: `${option.title}` }]);
  });

  const message = `
Category: ${question[0].category} 

*${entities.decode(question[0].title)}*
  `;
  var options = {
    parse_mode: "Markdown",
    force_reply: true,
    selective: false,
    reply_markup: JSON.stringify({
      keyboard,
      one_time_keyboard: true
    })
  };

  bot.sendMessage(msg.chat.id, message, options);
});

bot.onText(/\/status/, async (msg, match) => {
  const result = await getStatus(msg.chat.id);
  const message = `You have ${result[0].points} points and you answered ${result[0].answeredQuestionsTotal} questions. Go for another /question`;
  bot.sendMessage(msg.chat.id, message);
});
bot.onText(/\/addQuestion/, async (msg, match) => {
  try {
    const telegramId = msg.from.id;
    const result = await addQuestion();
    if (result) {
      return bot.sendMessage(
        telegramId,
        "A new question has added to our database from Open Trivia Database. /addQuestion now"
      );
    }

    return bot.sendMessage(
      telegramId,
      "Please try again. This question is already in our database"
    );
  } catch (err) {
    console.log(err);
  }
});

bot.onText(/\/start/, async (msg, match) => {
  const telegramId = msg.from.id;

  try {
    const user = await getUser(telegramId);
    if (!user) {
      await addUser(
        telegramId,
        msg.from.is_bot,
        msg.from.first_name,
        msg.from.last_name,
        msg.from.username,
        msg.from.language_code
      );
    }
    bot.sendMessage(
      telegramId,
      `Welcome @${msg.chat.username} type /question to start`,
      {
        parse_mode: "HTML"
      }
    );
  } catch (err) {
    console.log(err);
  }
});

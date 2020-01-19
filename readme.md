### Telegram Bot Trivia Game

#### Commands

`/start` When a user starts the bot. The app creates a new user on DB with name, surname, telegram ID, preferred language and is it a bot or not.

`/addQuestion` Add a new question to the database using the Open Trivia Database. Function shuffles the options and saves them to the database.

`/question` this commands renders a question with a custom keyboard. On the keyboard, there are options to select. Question command takes telegramId argument and checks if a user has already question to answer or not. If not it calls a new question from DB.

`status` Get users points and answered questions.

When an answer submitted the App checks if it is one of the current question options or not. If it is, it checks that it is correct or not.

#### Env

Just add your telegram token and mongoDB url.

TELEGRAM_TOKEN
MONGODB_URL

### ToDo

I will make this a multiplayer game with rankings. I made this app in about 7 hours. So there is more way to go.

Enjoy!

### Screens

![Start](https://www.interaktifis.com/github/telegram-trivia/1.jpg "Start")

![Question](https://www.interaktifis.com/github/telegram-trivia/2.jpg "Question")

![Answer](https://www.interaktifis.com/github/telegram-trivia/3.jpg "Answer")

![Correct](https://www.interaktifis.com/github/telegram-trivia/4.jpg "Correct")

![Status](https://www.interaktifis.com/github/telegram-trivia/5.jpg "Status")

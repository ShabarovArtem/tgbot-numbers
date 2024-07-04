//npm i node-telegram-bot-api nodemon

const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')
const token = '7303446282:AAHFPPftGUJoRh1CGiWFLEXZbRUM1e7oINE'

//передаём токен и опции
const bot = new TelegramApi(token, {polling: true})

const chats = {}


const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 9, угадай какое')
    const randomNumber = Math.floor(Math.random()*10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions)
}

//функция что будет запускать приложение
const start = () => {
    //повесим слушатель события на обработку сообщений
    bot.on('message', async msg => {

        //текст что отправил пользователь
        const text = msg.text
        //его Id
        const chatId = msg.chat.id


        bot.setMyCommands([
            {command: '/start', description: 'Начальное приветсвие'},
            {command: '/info', description: 'Получить информацию о пользователе'},
            {command: '/game', description: 'Угадай цифру'},
        ])


        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://sl.combot.org/monkke/webp/35xf09fa490.webp');
            return  bot.sendMessage(chatId, `Здарова друган`);
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`);
        }
        if (text === '/game') {
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, 'Напиши по нормальному');

    })

    bot.on('callback_query',  async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again'){
            return startGame(chatId);
        }
        if (data == chats[chatId]) {
            return bot.sendMessage(chatId, `Ты угадал!`, againOptions)
        } else {
            return bot.sendMessage(chatId, `Попробуй ещё раз(   Загаданная цифра: ${chats[chatId]}`, againOptions)
        }
    })
}

start()
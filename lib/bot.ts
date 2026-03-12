import TelegramBot, { KeyboardButton } from 'node-telegram-bot-api'
import { db } from './db'

const token = process.env.TELEGRAM_BOT_TOKEN!

if (!token) {
  throw new Error('TELEGRAM_BOT_TOKEN is not defined')
}

export const bot = new TelegramBot(token, { polling: true })

interface UserState {
  step: 'main' | 'service' | 'master' | 'date' | 'time' | 'name' | 'phone' | 'confirm'
  selectedService?: string
  selectedMaster?: string
  selectedDate?: string
  selectedTime?: string
  clientName?: string
  clientPhone?: string
}

const userStates: Map<number, UserState> = new Map()

const mainKeyboard = {
  reply_markup: {
    keyboard: [
      [{ text: '📋 Записаться' }],
      [{ text: '📅 Мои записи' }],
      [{ text: '❓ Помощь' }],
    ],
    resize_keyboard: true,
  } as TelegramBot.ReplyKeyboardMarkup,
}

export async function initBot() {
  console.log('🤖 Telegram bot started...')

  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id
    await bot.sendMessage(
      chatId,
      `Добро пожаловать в Beauty Studio! ✨\n\nВыберите действие:`,
      mainKeyboard
    )
  })

  bot.on('message', async (msg) => {
    const chatId = msg.chat.id
    const text = msg.text

    if (!text) return

    if (text === '📋 Записаться') {
      await startBooking(chatId)
    } else if (text === '📅 Мои записи') {
      await showMyAppointments(chatId, msg.from?.id?.toString())
    } else if (text === '❓ Помощь') {
      await bot.sendMessage(
        chatId,
        'Для записи нажмите "Записаться".\n\nКонтактный телефон: +7 (999) 123-45-67'
      )
    } else if (text === '🔙 Назад') {
      userStates.delete(chatId)
      await bot.sendMessage(chatId, 'Главное меню:', mainKeyboard)
    }
  })

  async function startBooking(chatId: number) {
    userStates.set(chatId, { step: 'service' })
    
    const categories = await db.categories.findMany()

    const keyboard: KeyboardButton[][] = categories.map((cat) => [
      { text: cat.name },
    ])

    await bot.sendMessage(chatId, 'Выберите категорию услуг:', {
      reply_markup: {
        keyboard: [...keyboard, [{ text: '🔙 Назад' }]],
        resize_keyboard: true,
      } as TelegramBot.ReplyKeyboardMarkup,
    })
  }

  async function showMyAppointments(chatId: number, telegramId?: string) {
    if (!telegramId) {
      await bot.sendMessage(chatId, 'Не удалось определить пользователя')
      return
    }

    const appointments = await db.appointments.findMany({
      where: { clientTelegramId: telegramId },
      orderBy: { dateTime: 'desc' },
      take: 5,
      include: { service: true, master: true },
    })

    if (appointments.length === 0) {
      await bot.sendMessage(chatId, 'У вас пока нет записей')
      return
    }

    const text = appointments
      .map((a: any) => {
        const date = new Date(a.dateTime).toLocaleString('ru-RU')
        return `📅 ${a.service?.name || 'Unknown'}\nМастер: ${a.master?.name || 'Любой'}\nДата: ${date}\nСтатус: ${a.status}`
      })
      .join('\n\n')

    await bot.sendMessage(chatId, text)
  }
}

initBot().catch(console.error)

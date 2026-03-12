import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_ADMIN_ID = process.env.TELEGRAM_ADMIN_ID
const TELEGRAM_GROUP_ID = process.env.TELEGRAM_GROUP_ID || '-5161615103'

async function sendToTelegram(chatId: string, message: string) {
  if (!TELEGRAM_BOT_TOKEN) return
  
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: message }),
  })
}

async function notifyAdmin(appointment: any) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_ADMIN_ID) {
    console.log('Telegram config missing:', { 
      TELEGRAM_BOT_TOKEN: !!TELEGRAM_BOT_TOKEN, 
      TELEGRAM_ADMIN_ID: !!TELEGRAM_ADMIN_ID 
    })
    return
  }

  const service = await db.services.findUnique({ id: appointment.serviceId })
  const master = appointment.masterId ? await db.masters.findUnique({ id: appointment.masterId }) : null

  const date = new Date(appointment.dateTime).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  })

  const message = `🔔 Новая запись!\n\n` +
    `Клиент: ${appointment.clientName}\n` +
    `Телефон: ${appointment.clientPhone}\n` +
    `Услуга: ${service?.name || 'Unknown'}\n` +
    `Цена: ${service?.price || 0} ₽\n` +
    `Мастер: ${master?.name || 'Любой'}\n` +
    `Дата: ${date}`

  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`
    
    const payload = {
      chat_id: TELEGRAM_ADMIN_ID,
      text: message,
    }
    
    console.log('Sending to Telegram:', { url, chat_id: TELEGRAM_ADMIN_ID })
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    
    const result = await response.json()
    console.log('Telegram API response:', result)
    
    if (!result.ok) {
      console.error('Telegram error:', result)
    }
  } catch (e) {
    console.error('Failed to notify admin:', e)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { serviceId, masterId, clientPhone, date, time } = body

    if (!clientPhone) {
      return NextResponse.json(
        { error: 'Введите номер телефона' },
        { status: 400 }
      )
    }

    const service = serviceId ? await db.services.findUnique({ id: serviceId }) : null
    const master = masterId ? await db.masters.findUnique({ id: masterId }) : null

    const appointment = await db.appointments.create({
      serviceId: serviceId || '',
      masterId: masterId || null,
      clientName: '',
      clientPhone,
      dateTime: date && time ? `${date}T${time}` : new Date().toISOString(),
      status: 'pending',
      clientTelegramId: null,
      notes: null,
    })

    const message = `🔔 Новая заявка!\n\n` +
      `Телефон: ${clientPhone}\n` +
      (service ? `Услуга: ${service.name}\nЦена: ${service.price} ₽\n` : '') +
      (master ? `Мастер: ${master.name}\n` : '') +
      (date && time ? `Дата и время: ${date} в ${time}` : '');

    if (TELEGRAM_BOT_TOKEN && TELEGRAM_ADMIN_ID) {
      try {
        await sendToTelegram(TELEGRAM_ADMIN_ID, message)
        await sendToTelegram(TELEGRAM_GROUP_ID, message)
      } catch (e) {
        console.error('Telegram error:', e)
      }
    }

    return NextResponse.json(appointment, { status: 201 })
  } catch (error) {
    console.error('Error creating appointment:', error)
    return NextResponse.json(
      { error: 'Ошибка при создании записи' },
      { status: 500 }
    )
  }
}

export async function GET() {
  const appointments = await db.appointments.findMany({
    orderBy: { dateTime: 'desc' },
    include: { service: true, master: true },
  })

  return NextResponse.json(appointments)
}

import fs from 'fs'
import path from 'path'

const DB_PATH = path.resolve(process.cwd(), 'data', 'db.json')
const APPOINTMENTS_PATH = path.resolve(process.cwd(), 'data', 'appointments.json')

export interface Category {
  id: string
  name: string
  slug: string
}

export interface Service {
  id: string
  name: string
  description: string | null
  price: number
  duration: number
  categoryId: string
}

export interface Master {
  id: string
  name: string
  specialty: string
  bio: string | null
  photo: string | null
}

export interface Appointment {
  id: string
  clientName: string
  clientPhone: string
  clientTelegramId: string | null
  serviceId: string
  masterId: string | null
  dateTime: string
  status: string
  notes: string | null
  createdAt: string
  updatedAt: string
}

interface DB {
  categories: Category[]
  services: Service[]
  masters: Master[]
}

function readDB(): DB {
  const data = fs.readFileSync(DB_PATH, 'utf-8')
  return JSON.parse(data)
}

function readAppointments(): Appointment[] {
  const data = fs.readFileSync(APPOINTMENTS_PATH, 'utf-8')
  return JSON.parse(data)
}

function writeAppointments(appointments: Appointment[]): void {
  fs.writeFileSync(APPOINTMENTS_PATH, JSON.stringify(appointments, null, 2), 'utf-8')
}

export const db = {
  // Categories
  categories: {
    findMany: async () => {
      const data = readDB()
      return data.categories
    },
    findUnique: async (where: { id: string }) => {
      const data = readDB()
      return data.categories.find(c => c.id === where.id) || null
    },
  },

  // Services
  services: {
    findMany: async (options?: { 
      where?: { categoryId?: string }
      include?: { category?: boolean }
      orderBy?: { price?: 'asc' | 'desc' }
      take?: number
    }) => {
      const data = readDB()
      let services = [...data.services]

      if (options?.where?.categoryId) {
        services = services.filter(s => s.categoryId === options.where!.categoryId)
      }

      if (options?.orderBy?.price) {
        services.sort((a, b) => options.orderBy!.price === 'asc' ? a.price - b.price : b.price - a.price)
      }

      if (options?.take) {
        services = services.slice(0, options.take)
      }

      if (options?.include?.category) {
        return services.map(s => ({
          ...s,
          category: data.categories.find(c => c.id === s.categoryId)
        }))
      }

      return services
    },
    findUnique: async (where: { id: string }) => {
      const data = readDB()
      return data.services.find(s => s.id === where.id) || null
    },
  },

  // Masters
  masters: {
    findMany: async (options?: { take?: number }) => {
      const data = readDB()
      let masters = [...data.masters]
      if (options?.take) {
        masters = masters.slice(0, options.take)
      }
      return masters
    },
    findUnique: async (where: { id: string }) => {
      const data = readDB()
      return data.masters.find(m => m.id === where.id) || null
    },
  },

  // Appointments (отдельный файл)
  appointments: {
    create: async (data: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => {
      const appointments = readAppointments()
      const now = new Date().toISOString()
      const appointment: Appointment = {
        ...data,
        id: 'apt_' + Date.now(),
        createdAt: now,
        updatedAt: now,
      }
      appointments.push(appointment)
      writeAppointments(appointments)
      return appointment
    },
    findMany: async (options?: { 
      where?: { clientTelegramId?: string }
      orderBy?: { dateTime?: 'desc' | 'asc' }
      take?: number
      include?: { service?: boolean; master?: boolean }
    }) => {
      let appointments = readAppointments()

      if (options?.where?.clientTelegramId) {
        appointments = appointments.filter(a => a.clientTelegramId === options.where!.clientTelegramId)
      }

      if (options?.orderBy?.dateTime) {
        appointments.sort((a, b) => {
          const diff = new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
          return options.orderBy!.dateTime === 'desc' ? -diff : diff
        })
      }

      if (options?.take) {
        appointments = appointments.slice(0, options.take)
      }

      if (options?.include?.service || options?.include?.master) {
        const dbData = readDB()
        appointments = appointments.map(a => ({
          ...a,
          ...(options.include?.service && { service: dbData.services.find(s => s.id === a.serviceId) }),
          ...(options.include?.master && a.masterId && { master: dbData.masters.find(m => m.id === a.masterId) }),
        }))
      }

      return appointments
    },
  },
}

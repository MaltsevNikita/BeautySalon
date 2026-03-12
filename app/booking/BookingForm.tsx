'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'

interface Service {
  id: string
  name: string
  price: number
  duration: number
  category?: { name: string }
}

interface Master {
  id: string
  name: string
  specialty: string
}

interface BookingFormProps {
  services: Service[]
  masters: Master[]
}

export default function BookingForm({ services, masters }: BookingFormProps) {
  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedMaster, setSelectedMaster] = useState<Master | null>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const formatPhone = (value: string): string => {
    const digits = value.replace(/\D/g, '').slice(0, 11)
    if (digits.length === 0) return ''
    if (digits.length <= 1) return '+' + digits
    if (digits.length <= 4) return `+${digits.slice(0,1)} (${digits.slice(1)}`
    if (digits.length <= 7) return `+${digits.slice(0,1)} (${digits.slice(1,4)}) ${digits.slice(4)}`
    if (digits.length <= 9) return `+${digits.slice(0,1)} (${digits.slice(1,4)}) ${digits.slice(4,7)}-${digits.slice(7)}`
    return `+${digits.slice(0,1)} (${digits.slice(1,4)}) ${digits.slice(4,7)}-${digits.slice(7,9)}-${digits.slice(9)}`
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value)
    setClientPhone(formatted)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const digits = clientPhone.replace(/\D/g, '')
    if (digits.length !== 11) {
      setError('Введите корректный номер телефона')
      return
    }
    
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          serviceId: selectedService?.id,
          masterId: selectedMaster?.id,
          clientPhone,
          date: selectedDate,
          time: selectedTime,
        }),
      })

      if (!response.ok) {
        throw new Error('Ошибка при отправке')
      }

      setStep(5)
    } catch (err) {
      setError('Что-то пошло не так. Попробуйте позже.')
    } finally {
      setLoading(false)
    }
  }

  const times = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00']

  return (
    <div className="py-12 md:py-16 pt-24 md:pt-28">
      <div className="container px-4 max-w-2xl">
        <h1 className="text-2xl md:text-4xl font-bold mb-6 md:mb-8 text-center">ЗАПИСЬ НА УСЛУГУ</h1>

        <Card>
          <CardContent className="p-4 md:p-8">
            {error && (
              <div className="bg-destructive/10 text-destructive p-4 mb-6 font-medium text-sm rounded-md">
                {error}
              </div>
            )}

            {step === 1 && (
              <div>
                <h2 className="text-xl font-bold mb-6 uppercase tracking-wide">Выберите услугу</h2>
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => {
                        setSelectedService(service)
                        setStep(2)
                      }}
                      className={`w-full p-4 text-left border rounded-lg transition-all ${
                        selectedService?.id === service.id
                          ? 'border-primary bg-primary/5'
                          : 'border-input hover:border-primary'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold">{service.name}</span>
                        <span className="text-primary font-bold">{service.price} ₽</span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {service.category?.name} • {service.duration} мин
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-xl font-bold mb-6 uppercase tracking-wide">Выберите мастера</h2>
                <button
                  onClick={() => {
                    setSelectedMaster(null)
                    setStep(3)
                  }}
                  className="w-full p-4 text-left border rounded-lg border-input hover:border-primary mb-3"
                >
                  <div className="font-bold">ЛЮБОЙ СПЕЦИАЛИСТ</div>
                  <div className="text-sm text-muted-foreground">Назначим свободного мастера</div>
                </button>
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {masters.map((master) => (
                    <button
                      key={master.id}
                      onClick={() => {
                        setSelectedMaster(master)
                        setStep(3)
                      }}
                      className={`w-full p-4 text-left border rounded-lg transition-all ${
                        selectedMaster?.id === master.id
                          ? 'border-primary bg-primary/5'
                          : 'border-input hover:border-primary'
                      }`}
                    >
                      <div className="font-bold">{master.name}</div>
                      <div className="text-sm text-muted-foreground uppercase tracking-wide">{master.specialty}</div>
                    </button>
                  ))}
                </div>
                <Button variant="ghost" onClick={() => setStep(1)} className="mt-6">
                  ← НАЗАД
                </Button>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-xl font-bold mb-6 uppercase tracking-wide">Выберите дату и время</h2>
                <div className="mb-6">
                  <Label htmlFor="date" className="block text-sm font-bold uppercase tracking-wide mb-3">Дата</Label>
                  <Input
                    id="date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="mb-6">
                  <Label className="block text-sm font-bold uppercase tracking-wide mb-3">Время</Label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {times.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
                <Button
                  onClick={() => setStep(4)}
                  disabled={!selectedDate || !selectedTime}
                  className="w-full"
                >
                  ПРОДОЛЖИТЬ
                </Button>
                <Button variant="ghost" onClick={() => setStep(2)} className="mt-4 w-full">
                  ← НАЗАД
                </Button>
              </div>
            )}

            {step === 4 && (
              <form onSubmit={handleSubmit}>
                <h2 className="text-xl font-bold mb-6 uppercase tracking-wide">Контактные данные</h2>
                
                <div className="mb-6">
                  <Label htmlFor="phone" className="block text-sm font-bold uppercase tracking-wide mb-2">Телефон</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={clientPhone}
                    onChange={handlePhoneChange}
                    required
                    placeholder="+7 (999) 123-45-67"
                  />
                </div>

                <div className="bg-secondary p-6 rounded-lg mb-6">
                  <h3 className="font-bold mb-3 uppercase tracking-wide">Детали записи:</h3>
                  <p className="font-medium">Услуга: {selectedService?.name} ({selectedService?.price} ₽)</p>
                  <p className="text-muted-foreground">Мастер: {selectedMaster?.name || 'Любой'}</p>
                  <p className="text-muted-foreground">Дата и время: {selectedDate} в {selectedTime}</p>
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? 'ОТПРАВКА...' : 'ПОДТВЕРДИТЬ ЗАПИСЬ'}
                </Button>
                <Button type="button" variant="ghost" onClick={() => setStep(3)} className="mt-4 w-full">
                  ← НАЗАД
                </Button>
              </form>
            )}

            {step === 5 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-3">ЗАПИСЬ ОФОРМЛЕНА!</h2>
                <p className="text-muted-foreground mb-8">
                  Мы свяжемся с вами для подтверждения.
                </p>
                <Button asChild>
                  <a href="/">НА ГЛАВНУЮ</a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

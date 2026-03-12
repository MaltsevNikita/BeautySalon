import { db } from '@/lib/db'
import BookingForm from './BookingForm'

export default async function BookingPage() {
  const services = await db.services.findMany({
    include: { category: true },
  })
  
  services.sort((a, b) => a.price - b.price)

  const masters = await db.masters.findMany()

  return <BookingForm services={services} masters={masters} />
}

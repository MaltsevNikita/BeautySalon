import { db } from '@/lib/db'
import MasterCard from '@/components/MasterCard'

export default async function MastersPage() {
  const masters = await db.masters.findMany()

  return (
    <div className="py-12 md:py-16 pt-24 md:pt-28">
      <div className="container px-4">
        <h1 className="text-2xl md:text-4xl font-bold mb-4">НАШИ МАСТЕРА</h1>
        <p className="text-muted-foreground mb-8 md:mb-12 max-w-2xl">
          Знакомьтесь с нашими профессионалами. Каждый мастер — эксперт 
          в своём деле с многолетним опытом работы.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {masters.map((master) => (
            <MasterCard key={master.id} master={master} />
          ))}
        </div>
      </div>
    </div>
  )
}

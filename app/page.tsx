import Link from 'next/link'
import { db } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import ServiceCard from '@/components/ServiceCard'
import MasterCard from '@/components/MasterCard'

export default async function Home() {
  const services = await db.services.findMany({
    take: 6,
    orderBy: { price: 'asc' },
    include: { category: true },
  })

  const masters = await db.masters.findMany({ take: 4 })

  const categories = await db.categories.findMany()

  return (
    <div>
      {/* Hero Section */}
      <section className="min-h-screen flex items-center pt-16 md:pt-20">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight">
              САЛОН <span className="text-primary">КРАСОТЫ</span>
            </h1>
            <p className="text-base md:text-xl text-muted-foreground mb-6 md:mb-8 max-w-xl">
              Профессиональные услуги красоты в уютной атмосфере. 
              Записывайтесь онлайн.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/booking">ЗАПИСАТЬСЯ</Link>
              </Button>
              <Button variant="outline" asChild size="lg" className="w-full sm:w-auto">
                <Link href="/services">УСЛУГИ</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-10 md:py-16 bg-secondary">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">УСЛУГИ</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/services?category=${category.slug}`}
              >
                <Card className="p-4 text-center hover:border-primary transition-colors cursor-pointer">
                  <span className="font-bold">{category.name}</span>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="py-10 md:py-16">
        <div className="container">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">ПОПУЛЯРНЫЕ УСЛУГИ</h2>
            <Link href="/services" className="text-primary hover:underline font-bold uppercase text-xs md:text-sm">
              Все услуги →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* Masters */}
      <section className="py-10 md:py-16 bg-secondary">
        <div className="container">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">НАШИ МАСТЕРА</h2>
            <Link href="/masters" className="text-primary hover:underline font-bold uppercase text-xs md:text-sm">
              Все мастера →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {masters.map((master) => (
              <MasterCard key={master.id} master={master} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-20 bg-primary">
        <div className="container text-center px-4">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-white">ГОТОВЫ ПРЕОБРАЗИТЬСЯ?</h2>
          <p className="text-base md:text-lg mb-6 md:mb-8 text-white/90">
            Запишитесь прямо сейчас и получите скидку 10% на первый визит!
          </p>
          <Button size="lg" asChild className="shadow-xl w-full sm:w-auto md:text-lg px-6 md:px-8">
            <Link href="/booking">
              ЗАПИСАТЬСЯ
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

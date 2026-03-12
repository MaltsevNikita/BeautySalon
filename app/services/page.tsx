import { db } from '@/lib/db'
import { Button } from '@/components/ui/button'
import ServiceCard from '@/components/ServiceCard'

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const params = await searchParams
  const categories = await db.categories.findMany()

  const selectedCategory = params.category
    ? categories.find((c) => c.slug === params.category)
    : null

  const allServices = await db.services.findMany({
    include: { category: true },
  })

  const services = selectedCategory
    ? allServices.filter((s) => s.categoryId === selectedCategory.id)
    : allServices

  services.sort((a, b) => a.price - b.price)

  return (
    <div className="py-12 md:py-16 pt-24 md:pt-28">
      <div className="container px-4">
        <h1 className="text-2xl md:text-4xl font-bold mb-6 md:mb-8">УСЛУГИ И ЦЕНЫ</h1>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8 md:mb-12">
          <Button variant={!selectedCategory ? "default" : "outline"} asChild size="sm">
            <a href="/services">Все</a>
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory?.id === category.id ? "default" : "outline"}
              asChild
              size="sm"
            >
              <a href={`/services?category=${category.slug}`}>{category.name}</a>
            </Button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </div>
  )
}

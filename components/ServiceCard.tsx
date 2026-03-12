import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ServiceCardProps {
  service: {
    id: string
    name: string
    description: string | null
    price: number
    duration: number
    category?: {
      name: string
    }
    categoryId?: string
  }
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const categoryName = service.category?.name || ''
  
  return (
    <Card className="transition-all hover:border-primary cursor-pointer">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg">{service.name}</h3>
          <span className="text-primary font-bold text-lg">
            {service.price} ₽
          </span>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          {service.description}
        </p>
        <div className="flex items-center justify-between">
          <Badge variant="secondary">{categoryName}</Badge>
          <span className="text-sm text-muted-foreground">{service.duration} мин</span>
        </div>
      </CardContent>
    </Card>
  )
}

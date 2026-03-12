import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'

interface MasterCardProps {
  master: {
    id: string
    name: string
    specialty: string
    bio: string | null
    photo: string | null
  }
}

export default function MasterCard({ master }: MasterCardProps) {
  return (
    <Card className="group overflow-hidden">
      <div className="relative h-80 bg-secondary overflow-hidden">
        {master.photo ? (
          <Image
            src={master.photo}
            alt={master.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        )}
      </div>
      <CardContent className="p-6">
        <h3 className="font-bold text-xl mb-1">{master.name}</h3>
        <p className="text-primary text-sm uppercase tracking-wide mb-3">{master.specialty}</p>
        {master.bio && (
          <p className="text-sm text-muted-foreground">{master.bio}</p>
        )}
      </CardContent>
    </Card>
  )
}

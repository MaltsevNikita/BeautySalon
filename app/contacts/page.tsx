import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ContactsPage() {
  return (
    <div className="py-12 md:py-16 pt-24 md:pt-28">
      <div className="container px-4">
        <h1 className="text-2xl md:text-4xl font-bold mb-8 md:mb-12">КОНТАКТЫ</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="uppercase tracking-wide">Связаться с нами</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-muted-foreground uppercase tracking-wide mb-1">Адрес</p>
                    <p className="font-bold">г. Москва, ул. Примерная, д. 10</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground uppercase tracking-wide mb-1">Телефон</p>
                    <a href="tel:+79991234567" className="font-bold hover:text-primary">
                      +7 (999) 123-45-67
                    </a>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground uppercase tracking-wide mb-1">Email</p>
                    <a href="mailto:info@beauty.ru" className="font-bold hover:text-primary">
                      info@beauty.ru
                    </a>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground uppercase tracking-wide mb-1">Время работы</p>
                    <p className="font-bold">Ежедневно: 10:00 - 21:00</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="min-h-[300px] md:min-h-[500px] bg-secondary flex items-center justify-center">
            <div className="text-center text-muted-foreground p-4">
              <svg className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p>Здесь будет карта</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

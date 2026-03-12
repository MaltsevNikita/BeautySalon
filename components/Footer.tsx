import Link from 'next/link'
import { Separator } from '@/components/ui/separator'

export default function Footer() {
  return (
    <footer className="border-t py-8 md:py-12 mt-auto bg-card">
      <div className="container px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 text-center sm:text-left">
          <div>
            <h3 className="font-bold text-lg mb-4">BEAUTY STUDIO</h3>
            <p className="text-sm text-muted-foreground">
              Салон красоты премиум класса. Мы создаём красоту и уверенность в себе.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">НАВИГАЦИЯ</h3>
            <div className="flex flex-col gap-2 text-sm">
              <Link href="/services" className="hover:text-primary">
                Услуги
              </Link>
              <Link href="/masters" className="hover:text-primary">
                Мастера
              </Link>
              <Link href="/contacts" className="hover:text-primary">
                Контакты
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">КОНТАКТЫ</h3>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <p>г. Москва, ул. Примерная, д. 10</p>
              <p>Ежедневно: 10:00 - 21:00</p>
              <p>+7 (999) 123-45-67</p>
            </div>
          </div>
        </div>
        
        <Separator className="mt-8" />
        <div className="mt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Beauty Studio. Все права защищены.
        </div>
      </div>
    </footer>
  )
}

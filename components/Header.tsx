'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b shadow-sm">
      <div className="container">
        <nav className="flex items-center justify-between h-16 md:h-20">
          <Link 
            href="/" 
            className="text-base md:text-lg font-bold tracking-tight hover:text-primary transition-colors"
          >
            BEAUTY STUDIO
          </Link>
          
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link 
              href="/services" 
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              УСЛУГИ
            </Link>
            <Link 
              href="/masters" 
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              МАСТЕРА
            </Link>
            <Link 
              href="/contacts" 
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              КОНТАКТЫ
            </Link>
          </div>

          <div className="hidden md:block">
            <Button asChild size="default">
              <Link href="/booking">
                ЗАПИСАТЬСЯ
              </Link>
            </Button>
          </div>

          <button 
            className="md:hidden p-2" 
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Меню"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {isOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-4">
              <Link 
                href="/services" 
                className="text-sm font-medium hover:text-primary transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                УСЛУГИ
              </Link>
              <Link 
                href="/masters" 
                className="text-sm font-medium hover:text-primary transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                МАСТЕРА
              </Link>
              <Link 
                href="/contacts" 
                className="text-sm font-medium hover:text-primary transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                КОНТАКТЫ
              </Link>
              <Button asChild className="mt-2">
                <Link href="/booking" onClick={() => setIsOpen(false)}>
                  ЗАПИСАТЬСЯ
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

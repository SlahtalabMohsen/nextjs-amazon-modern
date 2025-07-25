import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'

type CardItem = {
  title: string
  link: { text: string; href: string }
  items: {
    name: string
    items?: string[]
    image: string
    href: string
  }[]
}

export function HomeCard({ cards }: { cards: CardItem[] }) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-2'>
      {cards.map((card) => (
        <Card key={card.title} className='rounded-[1.5rem] flex flex-col neumorphic-light dark:neumorphic-dark bg-white/70 dark:bg-[#2d1d38]/70 backdrop-blur-sm animate-fade-in'>
          <CardContent className='p-6 flex-1'>
            <h3 className='text-xl font-bold mb-4 neumorphic-text dark:neumorphic-text-dark'>{card.title}</h3>
            <div className='grid grid-cols-2 gap-4'>
              {card.items.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className='flex flex-col transition-transform hover:scale-105 duration-300'
                >
                  <div className="rounded-xl bg-white p-3 mb-2 neumorphic-inset-light">
                    <Image
                      src={item.image}
                      alt={item.name}
                      className='aspect-square object-scale-down max-w-full h-auto mx-auto'
                      height={120}
                      width={120}
                    />
                  </div>
                  <p className='text-center text-sm whitespace-nowrap overflow-hidden text-ellipsis font-medium'>
                    {item.name}
                  </p>
                </Link>
              ))}
            </div>
          </CardContent>
          {card.link && (
            <CardFooter className="p-4">
              <Link 
                href={card.link.href} 
                className='w-full py-2 px-4 text-center rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity neumorphic-hover-light dark:neumorphic-hover-dark'
              >
                {card.link.text}
              </Link>
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  )
}

"use client"

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'

export default function OrderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const items = [
    { label: "Current", href: "/orders" },
    { label: "History", href: "/orders/history" },
  ]

  return (
    <div className="p-4">
      <div className='flex flex-col md:flex-row gap-4 mb-4'>
        <h1 className="text-3xl font-bold">Orders</h1>
        <Card className='flex sm:w-[400px]'>
          {items.map((item) => (
            <TabItem key={item.label} label={item.label} href={item.href} />
          ))}
        </Card>
      </div>
      {children}
    </div>
  );
}

function TabItem({ label, href }: { label: string, href: string }) {
  const currentPath = usePathname();
  const isActive = currentPath === href;

  return (
    <Link href={href}
      className="w-full"
    >
      {isActive ? (
        <Button variant="secondary" className="font-bold w-full">
          {label}
        </Button>
      ) : (
        <Button variant="ghost" className="w-full">
          {label}
        </Button>
      )}
    </Link>
  )
}

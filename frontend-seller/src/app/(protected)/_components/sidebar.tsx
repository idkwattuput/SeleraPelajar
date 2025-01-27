"use client"

import { io } from "socket.io-client";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ClipboardList, House, Store, Utensils } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { ReactNode, useEffect, useState } from 'react'
import { Order } from "@/types/order";
import useAxiosPrivate from "@/hooks/use-axios-private"

export default function Sidebar() {
  const BACKEND_URL = process.env.BACKEND_URL!
  const axiosPrivate = useAxiosPrivate()
  const [orderCount, setOrderCount] = useState(0)

  useEffect(() => {
    async function getOrders() {
      try {
        const response = await axiosPrivate.get("/api/v1/orders/seller")
        console.log(response.data.data)
        setOrderCount(response.data.data.length)
      } catch (error) {
        console.log(error)
      }
    }
    getOrders()
    const handleOrderChange = () => {
      getOrders();
    };
    window.addEventListener("orderChange", handleOrderChange);
    return () => {
      window.removeEventListener("orderChange", handleOrderChange);
    };
  }, [])


  useEffect(() => {
    const socket = io(`${BACKEND_URL}`);
    socket.on("connect", () => {
      console.log("Connected to the server");
    });

    socket.on("newOrder", (newData: Order) => {
      if (newData.status === "PENDING") {
        setOrderCount((prev) => prev + 1)
      }
    });

    socket.on("updateOrder", (newData: Order) => {
      if (newData.status === "COMPLETED" || newData.status === "CANCELLED") {
        setOrderCount((prev) => prev > 0 ? prev - 1 : 0)
      }
    });

    return () => {
      socket.off("connect");
      socket.off("updateOrder");
      socket.disconnect();
    };
  }, [])

  const items = [
    { label: "Dashboard", href: "/dashboard", icon: (<House />) },
    { label: "Order", href: "/orders", icon: (<ClipboardList />) },
    { label: "Cafe", href: "/cafe", icon: (<Store />) },
    { label: "Item", href: "/items", icon: (<Utensils />) },
  ];

  return (
    <aside className="p-4 w-[300px] flex flex-col justify-between items-center border-r border-muted">
      <div className="w-full flex flex-col gap-4">
        {items.map((item) => (
          <NavbarItem key={item.label} lable={item.label} link={item.href} icon={item.icon} counter={orderCount} />
        ))}
      </div>
    </aside>
  )
}

function NavbarItem({ lable, link, icon, counter }: { lable: string; link: string; icon: ReactNode; counter: number }) {
  const currentPath = usePathname();
  const isActive = currentPath === link;

  return (
    <Link href={link}
      className="w-full"
    >
      {isActive ? (
        <Button variant="secondary" className="font-bold w-full flex justify-start items-center">
          {icon}
          {lable}
        </Button>
      ) : (
        <Button variant="ghost" className="w-full flex justify-start items-center">
          {icon}
          {lable}
          {lable === "Order" && (
            counter > 0 && (
              <Badge>{counter}</Badge>
            )
          )}
        </Button>
      )}
    </Link>
  );
}


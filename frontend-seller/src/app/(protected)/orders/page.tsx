"use client"

import type { Order } from "@/types/order"
import { io } from "socket.io-client";
import { useEffect, useState } from "react"
import OrderFeed from "./_components/order-feed"
import useAxiosPrivate from "@/hooks/use-axios-private"
import { Card } from "@/components/ui/card";

export default function Order() {
  const BACKEND_URL = process.env.BACKEND_URL!
  const axiosPrivate = useAxiosPrivate()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getOrders() {
      try {
        setLoading(true)
        const response = await axiosPrivate.get("/api/v1/orders/seller")
        console.log(response.data.data)
        setOrders(response.data.data)
        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.log(error)
      }
    }
    getOrders()
  }, [])

  useEffect(() => {
    const socket = io(`${BACKEND_URL}`);
    socket.on("connect", () => {
      console.log("Connected to the server");
    });
    socket.on("newOrder", (newData: Order) => {
      setOrders(prev => [newData, ...prev]);
    });

    return () => {
      socket.off("connect");
      socket.off("newOrder");
      socket.disconnect();
    };
  }, [])

  function handleCancelOrderChange(order: Order) {
    setOrders((prev) => prev.filter((o) => o.id !== order.id))
  }

  function handleAcceptOrderChange(updatedOrder: Order) {
    setOrders((prev) =>
      prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
    )
  }


  return (
    <div className="p-4">
      <OrderFeed orders={orders} isLoading={loading} onCancelChange={handleCancelOrderChange} onAcceptChange={handleAcceptOrderChange} />
    </div>
  )
}


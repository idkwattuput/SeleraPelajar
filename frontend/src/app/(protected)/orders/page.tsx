"use client"

import useAxiosPrivate from "@/hooks/use-axios-private";
import { useEffect, useState } from "react";
import { Cafe } from "@/types/cafe";
import { Order } from "@/types/order";
import OrderFeed from "./_components/order-feed";

interface CustomOrder extends Order {
  cafe: Cafe
  created_at: string
}

export default function Orders() {
  const axiosPrivate = useAxiosPrivate()
  const [orders, setOrders] = useState<CustomOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getCarts() {
      try {
        setLoading(true)
        const response = await axiosPrivate.get("/api/v1/orders")
        setOrders(response.data.data)
        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.log(error)
      }
    }
    getCarts()
  }, [])

  function handleOnChange(order: Order) {
    setOrders(prev => prev.filter(o => o.id !== order.id))
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl lg:text-3xl font-bold">Current Orders</h1>
      <OrderFeed isLoading={loading} orders={orders} onChange={handleOnChange} />
    </div>
  )
}


"use client"

import useAxiosPrivate from "@/hooks/use-axios-private";
import { useEffect, useState } from "react";
import { Cafe } from "@/types/cafe";
import { Order } from "@/types/order";
import OrderHistoryFeed from "./_components/order-history-feed";

interface CustomOrder extends Order {
  cafe: Cafe
}

export default function HistoryOrders() {
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


  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">History Orders</h1>
      <OrderHistoryFeed isLoading={loading} orders={orders} />
    </div>
  )
}


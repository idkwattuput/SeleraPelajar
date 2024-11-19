"use client"

import useAxiosPrivate from "@/hooks/use-axios-private";
import CartFeeds from "./_components/cart-feed";
import { useEffect, useState } from "react";
import { Cafe } from "@/types/cafe";
import type { Cart } from "@/types/cart";

interface CustomCart extends Cart {
  cafe: Cafe
}

export default function Cart() {
  const axiosPrivate = useAxiosPrivate()
  const [carts, setCarts] = useState<CustomCart[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getCarts() {
      try {
        setLoading(true)
        const response = await axiosPrivate.get("/api/v1/carts")
        setCarts(response.data.data)
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
      <h1 className="text-3xl font-bold">Carts</h1>
      <CartFeeds isLoading={loading} carts={carts} />
    </div>
  )
}


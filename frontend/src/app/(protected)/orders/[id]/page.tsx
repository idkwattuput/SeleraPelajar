"use client"

import useAxiosPrivate from "@/hooks/use-axios-private"
import { io } from "socket.io-client";
import { Order } from "@/types/order"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams } from "next/navigation";

export default function OrderById() {
  const BACKEND_URL = process.env.BACKEND_URL!
  const params = useParams<{ tag: string; id: string }>()
  const axiosPrivate = useAxiosPrivate()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getOrder(id: string) {
      try {
        setLoading(true)
        const response = await axiosPrivate.get(`/api/v1/orders/${id}`)
        setOrder(response.data.data)
        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.log(error)
      }
    }
    getOrder(params.id)
  }, [])

  useEffect(() => {
    const socket = io(`${BACKEND_URL}`, {
      extraHeaders: {
        authorization: "ws"
      }
    });
    socket.on("connect", () => {
      console.log("Connected to the server");
    });

    socket.on("updateOrder", (newData: any) => {
      console.log("newData", newData);
      setOrder(newData);
    });

    return () => {
      socket.off("connect");
      socket.off("updateOrder");
      socket.disconnect();
    };
  }, [])

  if (loading) {
    <Card>
      <CardHeader>
        <CardTitle>Loading</CardTitle>
        <CardDescription>Loading</CardDescription>
      </CardHeader>
      <CardContent>Loading</CardContent>
    </Card>
  }


  return (
    <div>
      {order ? (
        <div>{order.status}</div>
      ) : (
        <div>Order not found</div>
      )}
    </div>
  )
}


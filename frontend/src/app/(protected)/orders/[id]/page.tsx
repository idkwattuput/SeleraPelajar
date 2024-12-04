"use client"

import useAxiosPrivate from "@/hooks/use-axios-private"
import { io } from "socket.io-client";
import { Order } from "@/types/order"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams } from "next/navigation";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { Cafe } from "@/types/cafe";
import { Badge } from "@/components/ui/badge";

interface CustomOrder extends Order {
  cafe: Cafe
}

export default function OrderById() {
  const BACKEND_URL = process.env.BACKEND_URL!
  const params = useParams<{ tag: string; id: string }>()
  const axiosPrivate = useAxiosPrivate()
  const [order, setOrder] = useState<CustomOrder | null>(null)
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
  }, [params.id])

  useEffect(() => {
    const socket = io(`${BACKEND_URL}`);
    socket.on("connect", () => {
      console.log("Connected to the server");
    });

    socket.on("updateOrder", (newData: CustomOrder) => {
      console.log(newData)
      window.dispatchEvent(new Event("orderChange"));
      setOrder(newData);
    });

    return () => {
      socket.off("connect");
      socket.off("updateOrder");
      socket.disconnect();
    };
  }, [])

  if (loading) {
    return (
      <div className="p-4">
        <SkeletonWrapper isLoading={loading}>
          <Card>
            <CardHeader>
              <CardTitle>Loading</CardTitle>
              <CardDescription>Loading</CardDescription>
            </CardHeader>
            <CardContent>Loading</CardContent>
          </Card>
        </SkeletonWrapper>
      </div>
    )
  }

  return (
    <div className="p-4">
      {order ? (
        <div>
          <StatusText status={order.status} />
          <div>
            <p className="text-muted-foreground">#{order.id}</p>
            <p className="mt-4">Cafe: {order.cafe.name}</p>
            <p className="flex items-center">
              Pickup Location: {order.cafe.block}-{order.cafe.lot}
            </p>
          </div>
          <div>
            {order.OrderItems.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div>
                  <p className="font-bold">{item.quantity}x {item.item.name}</p>
                  <p className="text-muted-foreground">{item.note}</p>
                </div>
                <p>RM {Number(Number(item.item.price) * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <p className="font-bold">Total: RM {Number(order.total_price).toFixed(2)}</p>
        </div>
      ) : (
        <div>Order not found</div>
      )}
    </div>
  )
}

function StatusText({ status }: { status: "PENDING" | "PREPARING" | "COMPLETED" | "CANCELLED" }) {
  return (
    <h1 className="text-3xl font-bold flex items-center gap-2">
      {status === "PENDING" && (
        <>
          We&apos;re reviewing your order details. Please hold on!
          <Badge className="bg-muted-foreground">{status}</Badge>
        </>
      )}
      {status === "PREPARING" && (
        <>
          Your order is being prepared. Stay tuned for updates!
          <Badge className="bg-yellow-500">{status}</Badge>
        </>
      )}
      {status === "COMPLETED" && (
        <>
          Order completed successfully. Please pickup your order!
          <Badge className="bg-emerald-500">{status}</Badge>
        </>
      )}
      {status === "CANCELLED" && (
        <>
          Your order has been cancelled
          <Badge className="bg-red-500">{status}</Badge>
        </>
      )}
    </h1>
  )
}


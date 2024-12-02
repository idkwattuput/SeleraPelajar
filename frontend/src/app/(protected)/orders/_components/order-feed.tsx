import SkeletonWrapper from "@/components/skeleton-wrapper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Cafe } from "@/types/cafe"
import { Order } from "@/types/order"
import { NotepadText } from "lucide-react";
import { Badge } from "@/components/ui/badge"
import OrderDetailDialog from "./order-detail-dialog"

interface CustomOrder extends Order {
  cafe: Cafe
  created_at: string
}

interface Props {
  isLoading: boolean
  orders: CustomOrder[]
  onChange: (order: Order) => void
}

export default function OrderFeed({ isLoading, orders, onChange }: Props) {
  if (isLoading) {
    return (
      <SkeletonWrapper isLoading={isLoading}>
        <Card>
          <CardHeader>
            <CardTitle>Loading</CardTitle>
            <CardDescription>Loading</CardDescription>
          </CardHeader>
          <CardContent>
            Loading
          </CardContent>
        </Card>
      </SkeletonWrapper>
    )
  }

  function formatDate(createdAt: string) {
    const date = new Date(createdAt);
    const formatter = new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false, // Use 24-hour format
      timeZone: "Asia/Kuala_Lumpur", // Set Malaysia time zone
    });
    return formatter.format(date).replace(',', ''); // Remove
  }

  return (
    <>
      {orders.length > 0 ?
        (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {orders.map((order) => (
              <OrderDetailDialog key={order.id} order={order} onChange={onChange}>
                <Card className="transition ease-in-out hover:-translate-y-1 hover:scale-105">
                  <CardHeader>
                    <CardTitle className="flex flex-row justify-between items-center">{order.cafe.name}
                      <Badge
                        className={order.status === "PENDING" ? "bg-muted-foreground" : "bg-yellow-500"}
                      >
                        {order.status}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="flex justify-start">#{order.id}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <p className="font-bold">RM {Number(order.total_price).toFixed(2)}</p>
                      <p>{order.OrderItems.length} items</p>
                    </div>
                    <p className="flex justify-end text-muted-foreground text-sm">{formatDate(order.created_at)}</p>
                  </CardContent>
                </Card>
              </OrderDetailDialog>
            ))}
          </div>
        ) : (
          <div className="h-screen flex flex-col justify-center items-center gap-2">
            <NotepadText className="text-muted-foreground w-10 h-10" />
            <p className="text-muted-foreground">There is no order yet</p>
          </div>
        )}
    </>
  )
}


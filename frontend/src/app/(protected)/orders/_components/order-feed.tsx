import SkeletonWrapper from "@/components/skeleton-wrapper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Cafe } from "@/types/cafe"
import { Order } from "@/types/order"
import Link from "next/link"
import { NotepadText } from "lucide-react";

interface CustomOrder extends Order {
  cafe: Cafe
}

interface Props {
  isLoading: boolean
  orders: CustomOrder[]
}

export default function OrderFeed({ isLoading, orders }: Props) {
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

  return (
    <>
      {orders.length > 0 ?
        (
          <div className="grid grid-cols-3 gap-4">
            {orders.map((order) => (
              <Link href={`/orders/${order.id}`} key={order.id}>
                <Card className="transition ease-in-out hover:-translate-y-1 hover:scale-105">
                  <CardHeader>
                    <CardTitle>{order.cafe.name}</CardTitle>
                    <CardDescription>Total: RM {Number(order.total_price).toFixed(2)}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    Item: {order.OrderItems.length}
                  </CardContent>
                </Card>
              </Link>
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


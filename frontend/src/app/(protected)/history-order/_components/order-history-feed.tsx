import SkeletonWrapper from "@/components/skeleton-wrapper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Cafe } from "@/types/cafe"
import { Order } from "@/types/order"
import Link from "next/link"

interface CustomOrder extends Order {
  cafe: Cafe
}

interface Props {
  isLoading: boolean
  orders: CustomOrder[]
}

export default function OrderHistoryFeed({ isLoading, orders }: Props) {
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
    <div className="grid grid-cols-3 gap-4">
      {orders.map((order) => (
        <Link href={`/history-order/${order.id}`} key={order.id}>
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
  )
}


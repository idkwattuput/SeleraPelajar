import SkeletonWrapper from "@/components/skeleton-wrapper"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Order, OrderItem } from "@/types/order"
import { NotepadText } from "lucide-react"
import CancelOrderDialog from "./cancel-order-dialog"
import AcceptOrderDialog from "./accept-order-dialog"
import CompleteOrderDialog from "./complete-order-dialog"
import { Item } from "@/types/item"

interface Props {
  orders: Order[]
  isLoading: boolean
  onCancelChange: (order: Order) => void
  onAcceptChange: (order: Order) => void
}

export default function OrderFeed({ orders, isLoading, onCancelChange, onAcceptChange }: Props) {

  function countQuantityItem(items: OrderItem[]) {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  if (isLoading) {
    return (
      <SkeletonWrapper isLoading={isLoading}>
        <Card>
          <CardHeader>
            <CardTitle>Loading</CardTitle>
            <CardDescription>Loading</CardDescription>
          </CardHeader>
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
              <Card key={order.id} className="transition ease-in-out hover:-translate-y-1 hover:scale-105">
                <CardHeader>
                  <CardTitle>{order.customer.first_name} {order.customer.last_name}</CardTitle>
                  <CardDescription>Total: RM {Number(order.total_price).toFixed(2)}</CardDescription>
                </CardHeader>
                <CardContent>
                  Item: {countQuantityItem(order.OrderItems)}
                </CardContent>
                <CardFooter className="flex justify-end items-end gap-4">
                  {order.status === "PENDING" ? (
                    <>
                      <CancelOrderDialog order={order} onChange={onCancelChange}>
                        <Button variant={"destructive"}>
                          Cancel
                        </Button>
                      </CancelOrderDialog>
                      <AcceptOrderDialog order={order} onChange={onAcceptChange}>
                        <Button>
                          Accept
                        </Button>
                      </AcceptOrderDialog>
                    </>
                  ) : (
                    <CompleteOrderDialog order={order} onChange={onCancelChange}>
                      <Button>
                        Complete
                      </Button>
                    </CompleteOrderDialog>
                  )}
                </CardFooter>
              </Card>
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


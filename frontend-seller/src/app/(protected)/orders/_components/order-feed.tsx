import SkeletonWrapper from "@/components/skeleton-wrapper"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Order, OrderItem } from "@/types/order"
import { NotepadText } from "lucide-react"
import CancelOrderDialog from "./cancel-order-dialog"
import AcceptOrderDialog from "./accept-order-dialog"
import CompleteOrderDialog from "./complete-order-dialog"
import OrderDetailDialog from "./order-detail-dialog"
import { Cafe } from "@/types/cafe"
import { Badge } from "@/components/ui/badge"

interface CustomOrder extends Order {
  cafe: Cafe
  created_at: string
}

interface Props {
  orders: CustomOrder[]
  isLoading: boolean
  onCancelChange: (order: Order) => void
  onAcceptChange: (order: Order) => void
}

export default function OrderFeed({ orders, isLoading, onCancelChange, onAcceptChange }: Props) {

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
              <OrderDetailDialog key={order.id} order={order}>
                <Card className="transition ease-in-out hover:-translate-y-1 hover:scale-105">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>#{order.id.slice(0, 4)}</CardTitle>
                      {order.status === "PENDING" && (<Badge>New</Badge>)}
                    </div>
                    <CardDescription>{formatDate(order.created_at)}</CardDescription>
                  </CardHeader>
                  <CardContent className="">
                    <div className="flex flex-col gap-4">
                      {order?.OrderItems.slice(0, 2).map((orderItem) => (
                        <div
                          key={orderItem.id}
                          className=""
                        >
                          <div className="flex justify-between items-center w-full">
                            <p className="capitalize">{orderItem.item.name}</p>
                            <p>x{orderItem.quantity}</p>
                          </div>
                          <p className="text-muted-foreground text-sm">{orderItem.note}</p>
                        </div>
                      ))}
                    </div>
                    {order?.OrderItems.length > 2 && (
                      <p className="text-muted-foreground text-sm">
                        +{order.OrderItems.length - 2} more item{order.OrderItems.length - 2 > 1 ? 's' : ''}
                      </p>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-center items-center gap-4">
                    <div className="text-xl font-bold w-full flex gap-2">
                      <p>Total:</p>
                      <p>RM {Number(order?.total_price).toFixed(2)}</p>
                    </div>
                    <div className="flex justify-end items-end gap-4">
                      {order.status === "PENDING" ? (
                        <>
                          <CancelOrderDialog order={order} onChange={onCancelChange}>
                            <Button
                              variant={"destructive"}
                              onClick={(e) => {
                                e.stopPropagation()
                              }}
                            >
                              Cancel
                            </Button>
                          </CancelOrderDialog>
                          <AcceptOrderDialog order={order} onChange={onAcceptChange}>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation()
                              }}
                            >
                              Accept
                            </Button>
                          </AcceptOrderDialog>
                        </>
                      ) : (
                        <CompleteOrderDialog order={order} onChange={onCancelChange}>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation()
                            }}
                          >
                            Complete
                          </Button>
                        </CompleteOrderDialog>
                      )}
                    </div>
                  </CardFooter>
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


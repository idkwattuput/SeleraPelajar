import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Cafe } from '@/types/cafe'
import { Order } from '@/types/order'
import { ReactNode } from 'react'

interface CustomOrder extends Order {
  cafe: Cafe
  created_at: string
}

interface Props {
  children: ReactNode
  order: CustomOrder
}

export default function OrderDetailDialog({ children, order }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <StatusText status={order.status} />
          <DialogDescription>#{order.id}</DialogDescription>
        </DialogHeader>
        <div>
          {order?.OrderItems.map((orderItem) => (
            <div
              key={orderItem.id}
              className="flex py-4 justify-between items-center"
            >
              <div>
                <div className="font-bold flex items-center gap-2">
                  <p>x{orderItem.quantity}</p>
                  <p className="capitalize">{orderItem.item.name}</p>
                </div>
                <p className="text-muted-foreground text-sm">{orderItem.note}</p>
              </div>
              <p className="">RM {Number(orderItem.quantity * Number(orderItem.item.price)).toFixed(2)}</p>
            </div>
          ))}
          <div className="text-xl font-bold w-full border-y border-primary py-2 flex justify-between items-end">
            <p>Total:</p>
            <p>RM {Number(order?.total_price).toFixed(2)}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function StatusText({ status }: { status: "PENDING" | "PREPARING" | "COMPLETED" | "CANCELLED" }) {
  return (
    <DialogTitle className="flex flex-col lg:flex-row items-center gap-2">
      Order Detail
      {status === "PENDING" && (
        <>
          <Badge className="bg-muted-foreground">{status}</Badge>
        </>
      )}
      {status === "PREPARING" && (
        <>
          <Badge className="bg-yellow-500">{status}</Badge>
        </>
      )}
      {status === "COMPLETED" && (
        <>
          <Badge className="bg-emerald-500">{status}</Badge>
        </>
      )}
      {status === "CANCELLED" && (
        <>
          <Badge className="bg-red-500">{status}</Badge>
        </>
      )}
    </DialogTitle>
  )
}


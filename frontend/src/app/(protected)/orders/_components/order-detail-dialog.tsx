import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Cafe } from '@/types/cafe'
import { Order } from '@/types/order'
import { ReactNode, useState } from 'react'
import CancelOrderDialog from './cancel-order-dialog'

interface CustomOrder extends Order {
  cafe: Cafe
  created_at: string
}

interface Props {
  children: ReactNode
  order: CustomOrder
  onChange: (order: Order) => void
}

export default function OrderDetailDialog({ children, order, onChange }: Props) {
  const [open, setOpen] = useState(false)

  function handleOnChange(order: Order) {
    onChange(order)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
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
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"secondary"}>Close</Button>
          </DialogClose>
          <CancelOrderDialog order={order} onChange={handleOnChange} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function StatusText({ status }: { status: "PENDING" | "PREPARING" | "COMPLETED" | "CANCELLED" }) {
  return (
    <DialogTitle className="flex flex-col lg:flex-row items-center gap-2">
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
    </DialogTitle>
  )
}


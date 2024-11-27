import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import useAxiosPrivate from "@/hooks/use-axios-private"
import { Order } from "@/types/order"
import { Loader2 } from "lucide-react"
import { ReactNode, useState } from "react"
import { toast } from "sonner"

interface Props {
  children: ReactNode
  order: Order
  onChange: (order: Order) => void
}

export default function CancelOrderDialog({ children, order, onChange }: Props) {
  const axiosPrivate = useAxiosPrivate()
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)

  async function cancelOrder(id: string) {
    try {
      setPending(true)
      const response = await axiosPrivate.put(`/api/v1/orders/${id}`,
        JSON.stringify({
          status: "CANCELLED"
        })
      )
      toast.success("Order has been cancel")
      onChange(response.data.data)
      setOpen(false)
      setPending(false)
    } catch (error) {
      setPending(false)
      console.log(error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel Order</DialogTitle>
          <DialogDescription>This action will cancel the customer order.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button disabled={pending} variant={"secondary"}>
              Close
            </Button>
          </DialogClose>
          <Button disabled={pending} variant={"destructive"} onClick={() => cancelOrder(order.id)}>
            {pending ? (<Loader2 className="animate-spin" />) : "Cancel"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


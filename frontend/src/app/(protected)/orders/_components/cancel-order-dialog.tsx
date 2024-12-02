import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import useAxiosPrivate from "@/hooks/use-axios-private"
import { Order } from "@/types/order"
import { useState } from "react"

interface Props {
  order: Order
  onChange: (order: Order) => void
}

export default function CancelOrderDialog({ order, onChange }: Props) {
  const axiosPrivate = useAxiosPrivate()
  const [pending, setPending] = useState(false)
  const [open, setOpen] = useState(false)

  async function cancelOrder(id: string) {
    try {
      setPending(true)
      const response = await axiosPrivate.put(`/api/v1/orders/${id}`,
        JSON.stringify({
          status: "CANCELLED"
        })
      )
      setOpen(false)
      onChange(response.data.data)
      setPending(false)
    } catch (error) {
      setPending(false)
      console.log(error)
    }
  }


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"destructive"}>Cancel</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel Order</DialogTitle>
          <DialogDescription>
            This action will cancel your order.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"secondary"}>Close</Button>
          </DialogClose>
          <Button
            variant={"destructive"}
            disabled={pending}
            onClick={() => cancelOrder(order.id)}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import useAxiosPrivate from "@/hooks/use-axios-private"
import { Loader2 } from "lucide-react"
import { ReactNode, useState } from "react"
import { CustomOrder } from "./order-feed"

interface Props {
  children: ReactNode
  order: CustomOrder
  onChange: (order: CustomOrder) => void
}

export default function AcceptOrderDialog({ children, order, onChange }: Props) {
  const axiosPrivate = useAxiosPrivate()
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)

  async function acceptOrder(id: string) {
    try {
      setPending(true)
      const response = await axiosPrivate.put(`/api/v1/orders/${id}`,
        JSON.stringify({
          status: "PREPARING"
        })
      )
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
          <DialogTitle>Accept Order</DialogTitle>
          <DialogDescription>This action will accept the customer order.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              disabled={pending}
              variant={"secondary"}
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              Close
            </Button>
          </DialogClose>
          <Button
            disabled={pending}
            onClick={(e) => {
              acceptOrder(order.id)
              e.stopPropagation()
            }}
          >
            {pending ? (<Loader2 className="animate-spin" />) : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}



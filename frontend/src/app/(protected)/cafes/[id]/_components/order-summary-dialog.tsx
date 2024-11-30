import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import useAxiosPrivate from "@/hooks/use-axios-private";
import { Cart } from "@/types/cart";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { toast } from "sonner";

interface Props {
  children: ReactNode
  cart: Cart
  resetCart: () => void
}

export default function OrderSummaryDialog({ children, cart, resetCart }: Props) {
  const axiosPrivate = useAxiosPrivate()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)

  async function placeOrder() {
    try {
      setPending(true)
      const response = await axiosPrivate.post("/api/v1/orders",
        JSON.stringify({
          cafeId: cart.cafe_id
        })
      )
      resetCart()
      const counter = localStorage.getItem("counter")
      localStorage.setItem("counter", String(Number(counter) - 1))
      window.dispatchEvent(new Event("cartChange"));
      window.dispatchEvent(new Event("orderChange"));
      toast.success("Order has been place")
      setOpen(false)
      setPending(false)
      router.push(`/orders/${response.data.data.id}`)
    } catch (error) {
      setPending(false)
      console.log(error)
    }
  }

  if (!cart || !cart.CartItems) {
    return (
      <div>Should not be visible</div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Order Summary</DialogTitle>
          <DialogDescription>This is summary of your order before placing any orders.</DialogDescription>
        </DialogHeader>
        <div>
          {cart?.CartItems.map((cartItem) => (
            <div
              key={`${cartItem.cafe_id}_${cartItem.customer_id}_${cartItem.item_id}_${cartItem.is_note}`}
              className="flex py-4 justify-between items-center"
            >
              <div>
                <div className="font-bold flex items-center gap-2">
                  <p>x{cartItem.quantity}</p>
                  <p className="capitalize">{cartItem.item.name}</p>
                </div>
                <p className="text-muted-foreground text-sm">{cartItem.note}</p>
              </div>
              <p className="">RM {Number(cartItem.quantity * Number(cartItem.item.price)).toFixed(2)}</p>
            </div>
          ))}
          <div className="text-xl lg:text-2xl font-bold w-full border-y border-primary py-2 flex justify-between items-end">
            <p>Total:</p>
            <p>RM {Number(cart?.total_price).toFixed(2)}</p>
          </div>
        </div>
        <DialogFooter className="gap-4">
          <DialogClose asChild>
            <Button
              variant={"secondary"}
              disabled={pending}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            disabled={pending}
            onClick={placeOrder}
          >
            {pending ? (<Loader2 className="animate-spin" />) : "Place Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


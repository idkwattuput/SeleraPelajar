import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import useAxiosPrivate from "@/hooks/use-axios-private";
import { Cart } from "@/types/cart";
import { Loader2 } from "lucide-react";
import { ReactNode, useState } from "react";

interface Props {
  children: ReactNode
  cart: Cart
  resetCart: () => void
}

export default function OrderSummaryDialog({ children, cart, resetCart }: Props) {
  const axiosPrivate = useAxiosPrivate()
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
      setOpen(false)
      setPending(false)
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
                <p>
                  x{cartItem.quantity}
                  <span className="ml-2 capitalize">
                    {cartItem.item.name}
                  </span>
                </p>
                <p className="text-muted-foreground text-sm">{cartItem.note}</p>
              </div>
              <p className="font-semibold">RM {Number(cartItem.quantity * Number(cartItem.item.price)).toFixed(2)}</p>
            </div>
          ))}
          <h1 className="text-2xl font-bold">
            Total: RM <span>{Number(cart?.total_price).toFixed(2)}</span>
          </h1>
        </div>
        <DialogFooter>
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


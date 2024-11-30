import useAxiosPrivate from "@/hooks/use-axios-private"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Cart, CartItem } from "@/types/cart"
import { useState } from "react"
import { Minus, Plus, ShoppingBasket, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import OrderSummaryDialog from "./order-summary-dialog"

interface Props {
  carts: Cart
  onNewCart: (newCart: Cart) => void
  resetCart: () => void
}

export default function CartSectionMobile({ carts, onNewCart, resetCart }: Props) {
  const axiosPrivate = useAxiosPrivate()
  const [pending, setPending] = useState(false)

  async function handleAddToCart(cartItem: CartItem) {
    try {
      setPending(true)
      const response = await axiosPrivate.post("/api/v1/carts",
        JSON.stringify({
          cafeId: cartItem.cafe_id,
          itemId: cartItem.item.id,
          quantity: 1,
          price: cartItem.item.price,
          isNote: cartItem.is_note,
          note: cartItem.note
        })
      )
      onNewCart(response.data.data)
      setPending(false)
      if (response.data.data.CartItems.length === 1) {
        localStorage.setItem("counter", "1")
        window.dispatchEvent(new Event("cartChange"));
      }
    } catch (error) {
      setPending(false)
      console.log(error)
    }
  }

  async function handleDecreaseQuantity(cartItem: CartItem) {
    try {
      setPending(true)
      const response = await axiosPrivate.put("/api/v1/carts",
        JSON.stringify({
          cafeId: cartItem.cafe_id,
          item: cartItem.item,
          quantity: 1,
          isNote: cartItem.is_note,
        })
      )
      onNewCart(response.data.data)
      setPending(false)
      if (response.data.data.CartItems.length === 0) {
        const counter = localStorage.getItem("counter")
        localStorage.setItem("counter", String(Number(counter) - 1))
        window.dispatchEvent(new Event("cartChange"));
      }
    } catch (error) {
      setPending(false)
      console.log(error)
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="w-full bg-primary text-primary-foreground rounded-lg p-4 flex justify-between items-center hover:cursor-pointer">
          <div className="flex items-center">
            <ShoppingBasket />
            {carts?.CartItems?.length || 0}
          </div>
          <p className="font-bold">View Cart</p>
          <p>RM {Number(carts?.total_price).toFixed(2)}</p>
        </div>
      </SheetTrigger>
      <SheetContent side={"bottom"}>
        <SheetHeader>
          <SheetTitle>Your Items</SheetTitle>
        </SheetHeader>
        <div className="divide-y">
          {carts?.CartItems?.map((cartItem) => (
            <div key={`${cartItem.cafe_id}_${cartItem.customer_id}_${cartItem.item_id}_${cartItem.is_note}`} className="flex py-4 justify-between items-center">
              <div>
                <p className="capitalize font-bold">{cartItem.item.name}</p>
                <p className="text-sm text-muted-foreground">{cartItem.note}</p>
                <p className="font-semibold">RM {Number(cartItem.quantity * Number(cartItem.item.price)).toFixed(2)}</p>
              </div>
              <div className="rounded-full bg-primary text-primary-foreground flex items-center gap-2">
                <Button
                  variant={"ghost"}
                  disabled={pending}
                  size={"icon"}
                  onClick={() => handleDecreaseQuantity(cartItem)}
                  className="rounded-full"
                >
                  {cartItem.quantity === 1 ? (<Trash />) : (<Minus />)}
                </Button>
                {cartItem.quantity}
                <Button
                  variant={"ghost"}
                  disabled={pending}
                  size={"icon"}
                  onClick={async () => handleAddToCart(cartItem)}
                  className="rounded-full"
                >
                  <Plus />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-primary py-2 font-bold text-2xl">
          Total: RM <span>{Number(carts?.total_price).toFixed(2)}</span>
        </div>
        <OrderSummaryDialog cart={carts} resetCart={resetCart}>
          <Button
            disabled={pending}
            className="w-full"
          >
            Review Order
          </Button>
        </OrderSummaryDialog>
      </SheetContent>
    </Sheet>
  )
}


"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import useAxiosPrivate from "@/hooks/use-axios-private"
import { Cart, CartItem } from "@/types/cart"
import { Minus, Plus, Trash } from "lucide-react"
import { useState } from "react"
import OrderSummaryDialog from "./order-summary-dialog"

interface Props {
  carts: Cart
  onNewCart: (newCart: Cart) => void
}

export default function CartSection({ carts, onNewCart }: Props) {
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
    } catch (error) {
      setPending(false)
      console.log(error)
    }
  }

  if (!carts || !carts.CartItems) {
    return (
      <Card className="p-4">
        <div>No item in the cart yet.</div>
      </Card>
    )
  }

  return (
    <Card className="p-4">
      <h2 className="text-3xl font-bold">Your Items</h2>
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
      <div>
        Total: RM <span>{Number(carts.total_price).toFixed(2)}</span>
      </div>
      <OrderSummaryDialog cart={carts}>
        <Button
          disabled={pending}
          className="w-full"
        >
          Review Order
        </Button>
      </OrderSummaryDialog>
    </Card>
  )
}


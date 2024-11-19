"use client"

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { Item } from "@/types/item"
import { Loader2, Plus, Trash } from "lucide-react"
import Image from "next/image"
import AddItemDialog from "./add-item-dialog"
import { Cart, CartItem } from "@/types/cart"
import useAxiosPrivate from "@/hooks/use-axios-private"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"

interface Props {
  items: Item[]
  handleNewCart: (newCart: Cart) => void
}

export default function ItemFeeds({ items, handleNewCart }: Props) {
  const BACKEND_URL = process.env.BACKEND_URL!
  const axiosPrivate = useAxiosPrivate()
  const [pending, setPending] = useState(false)

  async function handleAddToCart(item: Item) {
    try {
      setPending(true)
      const response = await axiosPrivate.post("/api/v1/carts",
        JSON.stringify({
          cafeId: item.cafe_id,
          itemId: item.id,
          quantity: 1,
          price: item.price,
          isNote: false,
          note: null
        })
      )
      handleNewCart(response.data.data)
      setPending(false)
      if (response.data.data.CartItems.length === 1) {
        const counter = localStorage.getItem("counter")
        if (counter) {
          localStorage.setItem("counter", String(Number(counter) + 1))
          window.dispatchEvent(new Event("cartChange"));
        } else {
          localStorage.setItem("counter", "1")
          window.dispatchEvent(new Event("cartChange"));
        }
      }
    } catch (error) {
      setPending(false)
      console.log(error)
    }
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {items.map((item) => (
        item.is_available ? (
          <AddItemDialog
            key={item.id}
            item={item}
            onNewCart={handleNewCart}
          >
            <Card
              className="p-4 flex justify-between items-start transition ease-in-out hover:-translate-y-1 hover:scale-105 hover:cursor-pointer"
            >
              <div>
                <CardTitle className="capitalize flex items-center gap-4">
                  {item.name}
                  <Badge className="capitalize">{item.category.name}</Badge>
                </CardTitle>
                <p>RM {Number(item.price).toFixed(2)}</p>
                <CardDescription>{item.description}</CardDescription>
              </div>
              <div className="relative">
                <Image
                  src={`${BACKEND_URL}/items/${item.image}`}
                  alt="item image"
                  width={150}
                  height={100}
                  className=" rounded-lg"
                />
                <Button
                  variant={"secondary"}
                  disabled={pending}
                  size={"icon"}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(item)
                  }}
                  className="rounded-full absolute bottom-0 right-0">
                  <Plus />
                </Button>
              </div>
            </Card>
          </AddItemDialog>
        ) : (
          <Card
            key={item.id}
            className="p-4 bg-secondary flex justify-between items-start transition ease-in-out hover:-translate-y-1 hover:scale-105"
          >
            <div>
              <CardTitle className="capitalize">{item.name}</CardTitle>
              <p>RM {Number(item.price).toFixed(2)}</p>
              <CardDescription>{item.description}</CardDescription>
            </div>
            <div className="relative">
              <Image
                src={`${BACKEND_URL}/items/${item.image}`}
                alt="item image"
                width={150}
                height={100}
                className=" rounded-lg"
              />
              <Button
                disabled={true}
                variant={"secondary"}
                size={"icon"}
                className="rounded-full absolute bottom-0 right-0">
                <Plus />
              </Button>
            </div>
          </Card>
        )
      ))}
    </div>
  )
}

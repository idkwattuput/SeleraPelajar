"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import useAxiosPrivate from "@/hooks/use-axios-private";
import { CartItem } from "@/types/cart";
import { Item } from "@/types/item";
import { Loader2, Minus, Plus } from "lucide-react";
import Image from "next/image";
import { ReactNode, useState } from "react";

interface Props {
  children: ReactNode
  item: Item
  onNewCart: (newCart: CartItem[]) => void
}

export default function AddItemDialog({ children, item, onNewCart }: Props) {
  const BACKEND_URL = process.env.BACKEND_URL!
  const axiosPrivate = useAxiosPrivate()
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [note, setNote] = useState("")

  async function handleAddToCart(item: Item) {
    try {
      setPending(true)
      const response = await axiosPrivate.post("/api/v1/carts",
        JSON.stringify({
          cafeId: item.cafe_id,
          itemId: item.id,
          quantity: quantity,
          price: item.price,
          isNote: note ? true : false,
          note: note ? note : null
        })
      )
      onNewCart(response.data.data)
      setQuantity(1)
      setNote("")
      setPending(false)
      setOpen(false)
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
      <DialogContent className="p-2">
        <DialogHeader>
          {item.image && (
            <Image
              src={`${BACKEND_URL}/items/${item.image}`}
              alt="item"
              width={650}
              height={650}
              className="rounded-xl"
            />
          )}
        </DialogHeader>
        <div className="">
          <div>
            <DialogTitle className="capitalize text-2xl">{item.name}</DialogTitle>
            <DialogDescription>{item.description}</DialogDescription>
            <p className="">RM {Number(item.price).toFixed(2)}</p>
          </div>
          <hr className="my-2 text-muted-foreground" />
          <div className="">
            <h1 className="text-2xl font-bold">Special Intructions</h1>
            <p className="mb-2 text-sm">
              Add any special intructions or requests for the restaurant (optional).
            </p>
            <Textarea
              placeholder="e.g. Tak nak sayur"
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="flex flex-row border-t pt-2">
          <div className="flex justify-start items-center ">
            {quantity === 1 ? (
              <Button disabled variant={"ghost"} size={"icon"}>
                <Minus />
              </Button>
            ) : (
              <Button
                variant={"ghost"}
                size={"icon"}
                onClick={() => setQuantity(quantity - 1)}
              >
                <Minus />
              </Button>
            )}
            <p>{quantity}</p>
            <Button
              variant={"ghost"}
              size={"icon"}
              onClick={() => setQuantity(quantity + 1)}
            >
              <Plus />
            </Button>
          </div>
          <Button
            className="w-full"
            onClick={() => handleAddToCart(item)}
          >
            {pending ? (<Loader2 className="animate-spin" />) : "Add To Cart"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


"use client"

import { useEffect, useState } from "react";
import ItemFeed from "./_components/item-feed";
import { Item } from "@/types/item";
import useAxiosPrivate from "@/hooks/use-axios-private";
import CreateItemDialog from "./_components/create-item-dialog";
import { Button } from "@/components/ui/button";

export default function Menu() {
  const axiosPrivate = useAxiosPrivate()
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getItems() {
      try {
        setLoading(true)
        const response = await axiosPrivate.get("/api/v1/cafes/items")
        setItems(response.data.data)
        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.log(error)
      }
    }
    getItems()
  }, [])

  function handleNewItemChange(item: Item) {
    setItems((prev) => [...prev, item])
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Menu</h1>
        <CreateItemDialog onChange={handleNewItemChange}>
          <Button>
            Create Item
          </Button>
        </CreateItemDialog>
      </div>
      <ItemFeed items={items} isLoading={loading} />
    </div>
  )
}


"use client"

import { useEffect, useState } from "react";
import ItemFeed from "./_components/item-feed";
import { Item } from "@/types/item";
import useAxiosPrivate from "@/hooks/use-axios-private";
import CreateItemDialog from "./_components/create-item-dialog";
import { Button } from "@/components/ui/button";
import type { Cafe } from "@/types/cafe";
import CafeProfile from "./_components/cafe-profile";

export default function Cafe() {
  const axiosPrivate = useAxiosPrivate()
  const [items, setItems] = useState<Item[]>([])
  const [cafe, setCafe] = useState<Cafe | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getItems() {
      try {
        setLoading(true)
        const response = await axiosPrivate.get("/api/v1/cafes/items")
        const anotherResponse = await axiosPrivate.get("/api/v1/cafes/seller")
        setItems(response.data.data)
        setCafe(anotherResponse.data.data)
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

  function handleItemChange(item: Item) {
    setItems(prev => prev.map((i) => i.id === item.id ? item : i))
  }

  function handleItemDelete(item: Item) {
    setItems(prev => prev.filter((i) => i.id !== item.id))
  }

  function handleUpdatedCafe(updatedCafe: Cafe) {
    setCafe(updatedCafe)
  }

  return (
    <div className="p-4">
      <CafeProfile cafe={cafe} onChange={handleUpdatedCafe} />
      <hr className="my-4" />
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Menu</h1>
        <CreateItemDialog onChange={handleNewItemChange}>
          <Button>
            Create Item
          </Button>
        </CreateItemDialog>
      </div>
      <ItemFeed items={items} isLoading={loading} onAvailableItem={handleItemChange} onItemDelete={handleItemDelete} />
    </div>
  )
}


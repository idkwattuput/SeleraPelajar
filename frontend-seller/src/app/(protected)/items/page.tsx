"use client"

import SkeletonWrapper from "@/components/skeleton-wrapper"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import useAxiosPrivate from "@/hooks/use-axios-private"
import { Item } from "@/types/item"
import { useEffect, useState } from "react"
import ItemFeed from "./_components/item-feed"
import CreateItemDialog from "./_components/create-item-dialog"
import { Button } from "@/components/ui/button"

export default function Items() {
  const axiosPrivate = useAxiosPrivate()
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<Item[]>([])

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

  function handleItemChange(item: Item) {
    setItems(prev => prev.map((i) => i.id === item.id ? item : i))
  }

  function handleItemDelete(item: Item) {
    setItems(prev => prev.filter((i) => i.id !== item.id))
  }

  if (loading) {
    return (
      <div className="p-4 grid grid-cols-3 gap-4">
        { /** The way to display 3 loading cards. **/}
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonWrapper key={index} isLoading={loading}>
            <Card>
              <CardHeader>
                <CardTitle>Loading</CardTitle>
                <CardDescription>Loading</CardDescription>
              </CardHeader>
            </Card>
          </SkeletonWrapper>
        ))}
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Your Items</h1>
        <CreateItemDialog onChange={handleNewItemChange}>
          <Button>
            {items.length > 0 ? "Add" : "Create"} Item
          </Button>
        </CreateItemDialog>
      </div>
      <ItemFeed items={items} isLoading={loading} onAvailableItem={handleItemChange} onItemDelete={handleItemDelete} />
    </div>
  )
}


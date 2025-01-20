import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Item } from "@/types/item"
import { Coffee, EllipsisVertical, Pencil, Trash } from "lucide-react";
import Image from "next/image";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { Switch } from "@/components/ui/switch";
import useAxiosPrivate from "@/hooks/use-axios-private";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import EditItemDialog from "./edit-item-dialog";
import { useEffect, useState } from "react";

interface Props {
  items: Item[]
  isLoading: boolean
  onAvailableItem: (item: Item) => Promise<void>
}

export default function ItemFeed({ items, isLoading, onAvailableItem }: Props) {
  const axiosPrivate = useAxiosPrivate()
  const BACKEND_URL = process.env.BACKEND_URL!
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [item, setItem] = useState<Item | null>(null)

  if (isLoading) {
    return (
      <SkeletonWrapper isLoading={isLoading}>
        <Card>
          <CardHeader>
            <CardTitle>Loading</CardTitle>
            <CardDescription>Loading</CardDescription>
          </CardHeader>
          <CardContent>Loading</CardContent>
        </Card>
      </SkeletonWrapper>
    )
  }

  //if (isDialogOpen) {
  //  return (
  //    <EditItemDialog item={item} onChange={onAvailableItem} open={isDialogOpen} onOpenChange={setIsDialogOpen} />
  //  )
  //}

  async function handleCheckChange(id: string, isAvailable: boolean) {
    try {
      const response = await axiosPrivate.put(`/api/v1/items/available/${id}`,
        JSON.stringify({
          isAvailable: !!isAvailable
        })
      )
      onAvailableItem(response.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="mt-4">
      {items.length <= 0 ? (
        <div className="text-muted-foreground h-screen flex flex-col justify-center items-center">
          <Coffee className="" />
          <p>No Item Yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {isDialogOpen && (
            <EditItemDialog item={item} onChange={onAvailableItem} open={isDialogOpen} onOpenChange={setIsDialogOpen} />
          )}
          {items.map((i) => (
            <Card
              key={i.id}
              className="p-4 h-[146px] flex justify-between items-start"
            >
              <div className="flex flex-col justify-between h-full">
                <div>
                  <CardTitle className="capitalize flex items-center gap-4">
                    {i.name}
                    <Badge className="capitalize">{i.category.name}</Badge>
                  </CardTitle>
                  <p>RM {Number(i.price).toFixed(2)}</p>
                  <CardDescription>{i.description}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <p>Available:</p>
                  <Switch checked={i.is_available} onClick={() => handleCheckChange(i.id, !i.is_available)} />
                </div>
              </div>
              {i.image && (
                <div className="relative">
                  <Image
                    src={`${BACKEND_URL}/items/${i.image}`}
                    alt="item image"
                    width={150}
                    height={100}
                    className=" rounded-lg"
                  />
                </div>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <EllipsisVertical className="hover:cursor-pointer" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => {
                      console.log(i)
                      setItem(i)
                      setIsDialogOpen(true)
                    }}
                  >
                    <Pencil />
                    <span>Edit</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-500 hover:text-red-500">
                    <Trash />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}


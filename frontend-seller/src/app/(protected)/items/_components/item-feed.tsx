import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Item } from "@/types/item"
import { Coffee, EllipsisVertical, Images, Pencil, Trash } from "lucide-react";
import Image from "next/image";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { Switch } from "@/components/ui/switch";
import useAxiosPrivate from "@/hooks/use-axios-private";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import EditItemDialog from "./edit-item-dialog";
import { useState } from "react";
import DeleteItemDialog from "./delete-item-dialog"
import EditItemImageDialog from "./edit-item-image-dialog";

interface Props {
  items: Item[]
  isLoading: boolean
  onAvailableItem: (item: Item) => void
  onItemDelete: (item: Item) => void
}

export default function ItemFeed({ items, isLoading, onItemDelete, onAvailableItem }: Props) {
  const axiosPrivate = useAxiosPrivate()
  const BACKEND_URL = process.env.BACKEND_URL!
  const [isEditImageDialogOpen, setIsEditImageDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
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
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {item && (
            <>
              {isEditDialogOpen && (
                <EditItemDialog item={item} onChange={onAvailableItem} open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} />
              )}
              {isDeleteDialogOpen && (
                <DeleteItemDialog item={item} onChange={onItemDelete} open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} />
              )}
              {isEditImageDialogOpen && (
                <EditItemImageDialog item={item} onChange={onAvailableItem} open={isEditImageDialogOpen} onOpenChange={setIsEditImageDialogOpen} />
              )}
            </>
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
              {i.image ? (
                <div className="relative">
                  <Image
                    src={`${BACKEND_URL}/items/${i.image}`}
                    alt="item image"
                    width={150}
                    height={100}
                    className=" rounded-lg"
                  />
                  <DropdownMenu>
                    <DropdownMenuTrigger className="absolute top-0 right-0">
                      <EllipsisVertical className="hover:cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => {
                          setItem(i)
                          setIsEditImageDialogOpen(true)
                        }}
                      >
                        <Images />
                        <span>{i.image ? "Edit" : "Add"} Images</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          setItem(i)
                          setIsEditDialogOpen(true)
                        }}
                      >
                        <Pencil />
                        <span>Edit Item</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-500 hover:text-red-500"
                        onClick={() => {
                          setItem(i)
                          setIsDeleteDialogOpen(true)
                        }}
                      >
                        <Trash />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <EllipsisVertical className="hover:cursor-pointer" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => {
                        setItem(i)
                        setIsEditImageDialogOpen(true)
                      }}
                    >
                      <Images />
                      <span>{i.image ? "Edit" : "Add"} Images</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        setItem(i)
                        setIsEditDialogOpen(true)
                      }}
                    >
                      <Pencil />
                      <span>Edit Item</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-500 hover:text-red-500"
                      onClick={() => {
                        setItem(i)
                        setIsDeleteDialogOpen(true)
                      }}
                    >
                      <Trash />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}


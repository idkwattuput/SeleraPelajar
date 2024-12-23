import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Item } from "@/types/item"
import { Coffee } from "lucide-react";
import Image from "next/image";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { Switch } from "@/components/ui/switch";
import useAxiosPrivate from "@/hooks/use-axios-private";

interface Props {
  items: Item[]
  isLoading: boolean
  onAvailableItem: (item: Item) => Promise<void>
}

export default function ItemFeed({ items, isLoading, onAvailableItem }: Props) {
  const axiosPrivate = useAxiosPrivate()
  const BACKEND_URL = process.env.BACKEND_URL!

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
      const response = await axiosPrivate.put(`/api/v1/items/${id}`,
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
          {items.map((item) => (
            <Card
              key={item.id}
              className="p-4 h-[146px] flex justify-between items-start"
            >
              <div className="flex flex-col justify-between h-full">
                <div>
                  <CardTitle className="capitalize flex items-center gap-4">
                    {item.name}
                    <Badge className="capitalize">{item.category.name}</Badge>
                  </CardTitle>
                  <p>RM {Number(item.price).toFixed(2)}</p>
                  <CardDescription>{item.description}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <p>Available:</p>
                  <Switch checked={item.is_available} onClick={() => handleCheckChange(item.id, !item.is_available)} />
                </div>
              </div>
              {item.image && (
                <div className="relative">
                  <Image
                    src={`${BACKEND_URL}/items/${item.image}`}
                    alt="item image"
                    width={150}
                    height={100}
                    className=" rounded-lg"
                  />
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}


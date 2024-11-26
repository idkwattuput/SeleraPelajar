import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Item } from "@/types/item"
import { Coffee } from "lucide-react";
import Image from "next/image";
import SkeletonWrapper from "@/components/skeleton-wrapper";

interface Props {
  items: Item[]
  isLoading: boolean
}

export default function ItemFeed({ items, isLoading }: Props) {
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
              className="p-4 min-h-[100px] flex justify-between items-start transition ease-in-out hover:-translate-y-1 hover:scale-105 hover:cursor-pointer"
            >
              <div>
                <CardTitle className="capitalize flex items-center gap-4">
                  {item.name}
                  <Badge className="capitalize">{item.category.name}</Badge>
                </CardTitle>
                <p>RM {Number(item.price).toFixed(2)}</p>
                <CardDescription>{item.description}</CardDescription>
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


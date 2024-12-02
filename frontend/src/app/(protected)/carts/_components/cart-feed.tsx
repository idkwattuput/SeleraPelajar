import SkeletonWrapper from "@/components/skeleton-wrapper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Cafe } from "@/types/cafe"
import { Cart } from "@/types/cart"
import Image from "next/image"
import Link from "next/link"

interface CustomCart extends Cart {
  cafe: Cafe
}

interface Props {
  isLoading: boolean
  carts: CustomCart[]
}

export default function CartFeeds({ isLoading, carts }: Props) {
  const BACKEND_URL = process.env.BACKEND_URL!

  if (isLoading) {
    return (
      <SkeletonWrapper isLoading={isLoading}>
        <Card>
          <CardHeader>
            <CardTitle>Loading</CardTitle>
            <CardDescription>Loading</CardDescription>
          </CardHeader>
          <CardContent>
            Loading
          </CardContent>
        </Card>
      </SkeletonWrapper>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {carts.map((cart) => (
        cart.CartItems.length > 0 &&
        <Link href={`/cafes/${cart.cafe_id}`} key={cart.cafe_id}>
          <Card className="transition ease-in-out hover:-translate-y-1 hover:scale-105">
            <div className="mt-4 flex justify-center items-center">
              <Image
                src={`${BACKEND_URL}/cafes/${cart.cafe.image}`}
                alt="cafeImage"
                width={500}
                height={400}
                className="rounded-lg max-h-[200px]"
              />
            </div>
            <hr className="my-4" />
            <CardContent>
              <CardTitle>{cart.cafe.name}</CardTitle>
              <div className="mt-2 flex justify-between items-center">
                <CardDescription>{cart.CartItems.length} items</CardDescription>
                <p>RM {Number(cart.total_price).toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

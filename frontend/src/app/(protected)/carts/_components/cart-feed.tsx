import SkeletonWrapper from "@/components/skeleton-wrapper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Cafe } from "@/types/cafe"
import { Cart } from "@/types/cart"
import Link from "next/link"

interface CustomCart extends Cart {
  cafe: Cafe
}

interface Props {
  isLoading: boolean
  carts: CustomCart[]
}

export default function CartFeeds({ isLoading, carts }: Props) {
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
            <CardHeader>
              <CardTitle>{cart.cafe.name}</CardTitle>
              <CardDescription>Total: RM {Number(cart.total_price).toFixed(2)}</CardDescription>
            </CardHeader>
            <CardContent>
              Item: {cart.CartItems.length}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}


"use client"

import SkeletonWrapper from "@/components/skeleton-wrapper"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import useAxiosPrivate from "@/hooks/use-axios-private"
import { Cafe } from "@/types/cafe"
import { MapPin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function CafeFeeds() {
  const BACKEND_URL = process.env.BACKEND_URL!
  const axiosPrivate = useAxiosPrivate()
  const [cafes, setCafes] = useState<Cafe[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getCafes() {
      try {
        setLoading(true)
        const response = await axiosPrivate.get("/api/v1/cafes")
        setCafes(response.data.data)
        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.log(error)
      }
    }
    getCafes()
  }, [])

  if (loading) {
    const card = [1, 2, 3, 4]

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {
          card.map((c: number) => (
            <SkeletonWrapper key={c} isLoading={loading}>
              <Card>
                <CardHeader>
                  <CardTitle>loading</CardTitle>
                  <CardDescription>loading</CardDescription>
                </CardHeader>
                <CardContent>loding</CardContent>
              </Card>
            </SkeletonWrapper>
          ))
        }
      </div>
    )
  }

  return (
    <div>
      {cafes.length <= 0 ? (
        <div>There is no cafe yet</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {cafes.map((cafe) => (
            <Link key={cafe.id} href={`/cafes/${cafe.id}`}>
              {cafe.is_open ? (
                <Card className="p-4 transition ease-in-out hover:-translate-y-1 hover:scale-105">
                  <div className="flex justify-center items-center">
                    <Image
                      src={`${BACKEND_URL}/cafes/${cafe.image}`}
                      alt="cafeImage"
                      width={500}
                      height={400}
                      className="rounded-lg max-h-[200px]"
                    />
                  </div>
                  <hr className="my-4" />
                  <CardTitle>{cafe.name}</CardTitle>
                  <CardDescription>{cafe.description}</CardDescription>
                  <CardDescription className="flex items-center mt-4"><MapPin className="h-4 w-4" />{cafe.block}-{cafe.lot}</CardDescription>
                </Card>
              ) : (
                <Card className="p-4 bg-secondary transition ease-in-out hover:-translate-y-1 hover:scale-105">
                  <div className="flex justify-center items-center">
                    <Image
                      src={`${BACKEND_URL}/cafes/${cafe.image}`}
                      alt="cafeImage"
                      width={500}
                      height={400}
                      className="rounded-lg max-h-[200px]"
                    />
                  </div>
                  <hr className="my-4" />
                  <CardTitle className="flex justify-between items-center">
                    {cafe.name}
                    <Badge variant={"destructive"}>Close</Badge>
                  </CardTitle>
                  <CardDescription>{cafe.description}</CardDescription>
                  <CardDescription className="flex items-center mt-4">
                    <MapPin className="h-4 w-4" />{cafe.block}-{cafe.lot}
                  </CardDescription>
                </Card>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}


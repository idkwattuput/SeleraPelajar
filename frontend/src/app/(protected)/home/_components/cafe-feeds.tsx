"use client"

import SkeletonWrapper from "@/components/skeleton-wrapper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import useAxiosPrivate from "@/hooks/use-axios-private"
import { Cafe } from "@/types/cafe"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function CafeFeeds() {
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
    return (
      <SkeletonWrapper isLoading={loading}>
        <Card>
          <CardHeader>
            <CardTitle>loading</CardTitle>
            <CardDescription>loading</CardDescription>
          </CardHeader>
          <CardContent>loding</CardContent>
        </Card>
      </SkeletonWrapper>
    )
  }

  return (
    <div>
      {cafes.length <= 0 ? (
        <div>There is no cafe yet</div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {cafes.map((cafe) => (
            <Link key={cafe.id} href={`/cafes/${cafe.id}`}>
              {cafe.is_open ? (
                <Card className="transition ease-in-out hover:-translate-y-1 hover:scale-110">
                  <CardHeader>
                    <CardTitle>{cafe.name}</CardTitle>
                    <CardDescription className="flex justify-between items-center">
                      {cafe.description}
                      <span>Location: {cafe.block}-{cafe.lot}</span>
                    </CardDescription>
                  </CardHeader>
                </Card>
              ) : (
                <Card className="bg-secondary transition ease-in-out hover:-translate-y-1 hover:scale-110">
                  <CardHeader>
                    <CardTitle>{cafe.name}</CardTitle>
                    <CardDescription className="flex justify-between items-center">
                      {cafe.description}
                      <span>Location: {cafe.block}-{cafe.lot}</span>
                    </CardDescription>
                  </CardHeader>
                </Card>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}


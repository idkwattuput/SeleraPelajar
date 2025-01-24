"use client"

import { useEffect, useState } from "react";
import Image from "next/image";
import useAxiosPrivate from "@/hooks/use-axios-private";
import { Button } from "@/components/ui/button";
import type { Cafe } from "@/types/cafe";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import EditCafeImageDialog from "./_components/edit-cafe-image-dialog";
import { Images, Pencil, Plus } from "lucide-react";
import EditCafeForm from "./_components/edit-cafe-form";

export default function Cafe() {
  const BACKEND_URL = process.env.BACKEND_URL!
  const axiosPrivate = useAxiosPrivate()
  const [cafe, setCafe] = useState<Cafe | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getItems() {
      try {
        setLoading(true)
        const anotherResponse = await axiosPrivate.get("/api/v1/cafes/seller")
        setCafe(anotherResponse.data.data)
        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.log(error)
      }
    }
    getItems()
  }, [])

  function handleUpdatedCafe(updatedCafe: Cafe) {
    setCafe(updatedCafe)
  }

  if (loading) {
    return (
      <div className="p-4 flex gap-4">
        <SkeletonWrapper isLoading={loading} className="w-[200px]">
          <Card>
            <CardHeader>
              <CardTitle>Loading</CardTitle>
              <CardDescription>Loading</CardDescription>
            </CardHeader>
          </Card>
        </SkeletonWrapper>
        <SkeletonWrapper isLoading={loading} className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle>Loading</CardTitle>
              <CardDescription>Loading</CardDescription>
            </CardHeader>
          </Card>
        </SkeletonWrapper>
      </div>
    )
  }

  return (
    <div className="p-4">
      <h1 className="mb-4 text-3xl font-bold">Cafe</h1>
      <div className="flex gap-4">
        {cafe?.image ? (
          <div className="relative w-fit">
            <Image
              src={`${BACKEND_URL}/cafes/${cafe.image}`}
              width={200}
              height={200}
              alt="cafeImage"
              className="rounded-lg max-h-[200px]"
            />
            <EditCafeImageDialog onChange={handleUpdatedCafe}>
              <Button
                size={"icon"}
                variant={"secondary"}
                className="absolute rounded-full top-1 right-1"
              >
                <Pencil />
              </Button>
            </EditCafeImageDialog>
          </div>
        ) : (
          <div className="relative w-fit">
            <Card className="w-[200px] h-[100px] flex justify-center items-center">
              <Images className="text-muted-foreground" />
            </Card>
            <EditCafeImageDialog onChange={handleUpdatedCafe}>
              <Button
                size={"icon"}
                variant={"secondary"}
                className="absolute rounded-full top-1 right-1"
              >
                <Plus />
              </Button>
            </EditCafeImageDialog>
          </div>
        )}
        {cafe && (
          <EditCafeForm cafe={cafe} onChange={handleUpdatedCafe} />
        )}
      </div>
    </div>
  )
}


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
import { Switch } from "@/components/ui/switch";

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

  async function handleCheckChange(id: string, value: boolean) {
    try {
      const response = await axiosPrivate.put(`/api/v1/cafes/${id}`,
        JSON.stringify({
          isOpen: !!value
        })
      )
      setCafe(response.data.data)
    } catch (error) {
      console.log(error)
    }
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
      <div className="mb-4 flex items-center gap-4">
        <h1 className="text-3xl font-bold">Cafe</h1>
        {cafe && (
          <div className="flex items-center gap-2">
            <p>{cafe.is_open ? "Open" : "Close"}</p>
            <Switch checked={!!cafe.is_open} onClick={() => handleCheckChange(cafe.id, !cafe.is_open)} />
          </div>
        )}
      </div>
      <div className="flex flex-col md:flex-row gap-4">
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


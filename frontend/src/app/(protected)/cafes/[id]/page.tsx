"use client"

import { useParams } from "next/navigation";
import CafeInfo from "./_components/cafe-info";
import useAxiosPrivate from "@/hooks/use-axios-private"
import SkeletonWrapper from "@/components/skeleton-wrapper"
import type { Cafe } from "@/types/cafe";
import { useEffect, useState } from "react"

export default function Cafe() {
  const axiosPrivate = useAxiosPrivate()
  const params = useParams<{ tag: string; id: string }>()
  const [cafes, setCafes] = useState<Cafe>({})
  const [notFound, setNotFound] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getCafe(id: string) {
      try {
        setLoading(true)
        const response = await axiosPrivate.get(`/api/v1/cafes/${id}`)
        setCafes(response.data.data)
        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.log(error)
        if (error.response?.status === 404) {
          setNotFound(true)
        }
      }
    }
    getCafe(params.id)
  }, [params.id])

  return (
    <div className="p-4">
      {notFound ? (
        <div>Cafe not found</div>
      ) : (
        <>
          <SkeletonWrapper isLoading={loading}>
            <CafeInfo cafe={cafes} />
          </SkeletonWrapper>
          <hr className="my-4" />
        </>
      )}
    </div>
  )
}


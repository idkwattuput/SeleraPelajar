"use client"

import { useParams } from "next/navigation";
import CafeInfo from "./_components/cafe-info";
import useAxiosPrivate from "@/hooks/use-axios-private"
import SkeletonWrapper from "@/components/skeleton-wrapper"
import type { Cafe } from "@/types/cafe";
import { useEffect, useState } from "react"
import ItemFeeds from "./_components/item-feeds";
import SearchItems from "./_components/search-item";
import CartSection from "./_components/cart-section";
import { CartItem } from "@/types/cart";
import { Item } from "@/types/item";

export default function Cafe() {
  const axiosPrivate = useAxiosPrivate()
  const params = useParams<{ tag: string; id: string }>()
  const [cafes, setCafes] = useState<Cafe>({})
  const [items, setItems] = useState<Item[]>([])
  const [filteredItems, setFilteredItems] = useState<Item[]>([])
  const [carts, setCarts] = useState<CartItem[]>([])
  const [notFound, setNotFound] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getCafe(id: string) {
      try {
        setLoading(true)
        const response = await axiosPrivate.get(`/api/v1/cafes/${id}`)
        const anotherResponse = await axiosPrivate.get(`/api/v1/carts/cafes/${id}`)
        setCafes(response.data.data)
        setItems(response.data.data.Items)
        setFilteredItems(response.data.data.Items)
        setCarts(anotherResponse.data.data?.CartItems || [])
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

  function onCartChange(newCart: CartItem[]) {
    setCarts(newCart)
  }

  function handleSearchItem(value: string) {
    if (value.trim() === "") {
      setFilteredItems(items)
    }
    setFilteredItems(items.filter((item) => item.name.toLowerCase().includes(value.toLowerCase().trim())))
  }

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
          <SkeletonWrapper isLoading={loading}>
            <SearchItems items={items} onSearch={handleSearchItem} />
          </SkeletonWrapper>
          <hr className="my-4" />
          <div className="w-full flex gap-4">
            <div className="w-3/4">
              <SkeletonWrapper isLoading={loading}>
                <ItemFeeds items={filteredItems} handleNewCart={onCartChange} />
              </SkeletonWrapper>
            </div>
            <div className="w-1/4">
              <SkeletonWrapper isLoading={loading}>
                <CartSection carts={carts} onNewCart={onCartChange} />
              </SkeletonWrapper>
            </div>
          </div>
        </>
      )}
    </div>
  )
}


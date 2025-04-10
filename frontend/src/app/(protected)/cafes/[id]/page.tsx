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
import { Cart } from "@/types/cart";
import { Item } from "@/types/item";
import CartSectionMobile from "./_components/cart-section-mobile";

export default function Cafe() {
  const axiosPrivate = useAxiosPrivate()
  const params = useParams<{ tag: string; id: string }>()
  const [cafes, setCafes] = useState<Cafe | null>(null)
  const [items, setItems] = useState<Item[]>([])
  const [filteredItems, setFilteredItems] = useState<Item[]>([])
  const [carts, setCarts] = useState<Cart | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getCafe(id: string) {
      try {
        setLoading(true)
        const response = await axiosPrivate.get(`/api/v1/cafes/${id}`)
        setCafes(response.data.data || {})
        setItems(response.data.data.Items)
        setFilteredItems(response.data.data.Items)
        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.log(error)
        // @ts-expect-error "idk"
        if (error.response?.status === 404) {
          setNotFound(true)
        }
      }
    }
    async function getCarts(id: string) {
      try {
        setLoading(true)
        const anotherResponse = await axiosPrivate.get(`/api/v1/carts/cafes/${id}`)
        setCarts(anotherResponse.data.data || {})
        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.log(error)
        // @ts-expect-error "idk"
        if (error.response?.status === 404) {
          setNotFound(true)
        }
      }
    }
    getCafe(params.id)
    getCarts(params.id)
  }, [params.id])

  function onCartChange(newCart: Cart) {
    setCarts(newCart)
  }

  function handleSearchItem(value: string) {
    if (value.trim() === "") {
      setFilteredItems(items)
    }
    setFilteredItems(items.filter((item) => item.name.toLowerCase().includes(value.toLowerCase().trim())))
  }

  function handleResetCart() {
    setCarts(null)
  }

  function handleCategoryClick(category: string) {
    setFilteredItems(items.filter((item) => item.category.name === category))
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
            <SearchItems items={items} onSearch={handleSearchItem} onCategoryClick={handleCategoryClick} />
          </SkeletonWrapper>
          <hr className="my-4" />
          <div className="w-full flex gap-4">
            <div className="w-full lg:w-3/4">
              <SkeletonWrapper isLoading={loading}>
                <ItemFeeds items={filteredItems} handleNewCart={onCartChange} />
              </SkeletonWrapper>
            </div>
            <div className="hidden lg:block lg:w-1/4">
              <SkeletonWrapper isLoading={loading}>
                <CartSection carts={carts} onNewCart={onCartChange} resetCart={handleResetCart} />
              </SkeletonWrapper>
            </div>
          </div>
          {carts?.CartItems && carts?.CartItems.length > 0 && (
            <div className="mt-4 sticky bottom-0 z-10 lg:hidden">
              <CartSectionMobile carts={carts} onNewCart={onCartChange} resetCart={handleResetCart} />
            </div>
          )}
        </>
      )}
    </div>
  )
}


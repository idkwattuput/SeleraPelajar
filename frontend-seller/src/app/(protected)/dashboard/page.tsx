"use client"

import useAxiosPrivate from "@/hooks/use-axios-private"
import { useEffect, useState } from "react"
import Summary from "./_components/summary"
import { WeekRevenueChart } from "./_components/revenue-chart"

export interface Revenue {
  day: string
  revenue: number
}

export default function Dashboard() {
  const axiosPrivate = useAxiosPrivate()
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState<string | null>(null)
  const [revenue, setRevenue] = useState<Revenue[]>([])
  const [summary, setSummary] = useState({
    order_today: 0,
    revenue_today: "0.00",
    order_week: 0,
    popular_item: "none",
  })

  useEffect(() => {
    async function getSummary() {
      try {
        setLoading(true)
        const response = await axiosPrivate.get("/api/v1/summary")
        const anotherResponse = await axiosPrivate.get("/api/v1/summary/week-revenue")
        setSummary(response.data.data)
        console.log(anotherResponse.data.data)
        setRevenue(anotherResponse.data.data)
        setName(response.data.data.seller.first_name)
        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.log(error)
      }
    }
    getSummary()
  }, [])

  return (
    <div className="p-4">
      {name && (
        <h1 className="text-4xl font-bold">Welcome, {name}</h1>
      )}
      <Summary summary={summary} isLoading={loading} />

      <div className="mt-4">
        <WeekRevenueChart revenueSummary={revenue} />
      </div>
    </div>
  )
}


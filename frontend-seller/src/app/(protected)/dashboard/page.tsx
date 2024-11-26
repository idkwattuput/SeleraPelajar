"use client"

import useAxiosPrivate from "@/hooks/use-axios-private"
import { useEffect, useState } from "react"
import Summary from "./_components/summary"

export default function Dashboard() {
  const axiosPrivate = useAxiosPrivate()
  const [loading, setLoading] = useState(true)
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
        setSummary(response.data.data)
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
      <h1 className="text-4xl font-bold">Welcome User</h1>
      <Summary summary={summary} isLoading={loading} />
    </div>
  )
}


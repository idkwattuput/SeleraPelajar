"use client"

import useAxiosPrivate from "@/hooks/use-axios-private"
import { useEffect, useState } from "react"
import ProfileForm from "./_components/profile-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export interface User {
  first_name: string
  last_name: string
  email: string
}

export default function Profile() {
  const axiosPrivate = useAxiosPrivate()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getUser() {
      try {
        setLoading(true)
        const response = await axiosPrivate.get("/api/v1/users")
        setUser(response.data.data)
        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.log(error)
      }
    }
    getUser()
  }, [])

  function handleUserChange(user: User) {
    setUser(user)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Profile information will be displayed on seller dashboard</CardDescription>
        <CardContent className="p-0 pt-4">
          <ProfileForm user={user} isLoading={loading} onChange={handleUserChange} />
        </CardContent>
      </CardHeader>
    </Card>
  )
}

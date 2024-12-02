"use client"

import useAxiosPrivate from "@/hooks/use-axios-private"
import { useEffect, useState } from "react"
import ProfileForm from "./_components/profile-form"
import ChangePasswordForm from "./_components/change-password-form"

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
    <div className="p-4">
      <h1 className="mb-4 text-2xl lg:text-3xl font-bold">Profile</h1>
      <ProfileForm user={user} isLoading={loading} onChange={handleUserChange} />
      <h1 className="my-4 text-2xl lg:text-3xl font-bold">Change Password</h1>
      <ChangePasswordForm onChange={handleUserChange} />
    </div>
  )
}


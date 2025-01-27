"use client"

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CircleUser } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";

export default function Navbar() {
  const router = useRouter()

  async function logout() {
    try {
      await axios.get("/api/v1/auth/logout", {
        withCredentials: true,
      })
      router.push("/login")
    } catch (error) {
      console.error((error))
    }
  }

  return (
    <nav className="flex justify-between items-center p-4 border-b border-muted">
      <h1 className="text-3xl font-bold">Selera Pelajar</h1>
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full"
            >
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link href={"/profile"}>
              <DropdownMenuItem>Profile</DropdownMenuItem>
            </Link>
            <DropdownMenuItem onClick={logout} className="text-red-500">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}


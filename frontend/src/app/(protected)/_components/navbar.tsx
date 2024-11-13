"use client";

import SkeletonWrapper from "@/components/skeleton-wrapper";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import useAxiosPrivate from "@/hooks/use-axios-private";
import axios from "@/lib/axios";
import {
  ShoppingBasket,
  CircleUser,
  Menu,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const items = [
  { label: "Home", href: "/home" },
  { label: "Recent Order", href: "/recent-order" },
  { label: "History Order", href: "/history-order" },
];

const mobileItems = [
  { label: "Home", href: "/home" },
  { label: "Recent Order", href: "/recent-order" },
  { label: "History Order", href: "/history-order" },
  { label: "Profile", href: "/profile" },
];

export default function Navbar() {
  return (
    <>
      <DesktopNavbar />
      <MobileNavbar />
    </>
  );
}

function DesktopNavbar() {
  const router = useRouter()
  const [counter, setCounter] = useState(localStorage.getItem("counter"))


  useEffect(() => {
    async function getCarts() {
      try {
        setCounter(localStorage.getItem("counter"))
      } catch (error) {
        console.log(error)
      }
    }

    getCarts()

    const handleCartChange = () => {
      getCarts();
    };

    window.addEventListener("cartChange", handleCartChange);

    return () => {
      window.removeEventListener("cartChange", handleCartChange);
    };
  }, [])

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
    <nav className="hidden p-4 md:flex justify-between items-center">
      <div className="flex items-center gap-2">
        <h1 className="text-3xl font-bold italic">Selera Pelajar</h1>
      </div>
      <ul className="flex items-center gap-8">
        <Link href={"/carts"}
          className="w-full"
        >
          <Button variant="ghost" className="font-bold">
            <ShoppingBasket className="w-4 h-4" />
            {Number(counter) > 0 && counter}
          </Button>
        </Link>
        {items.map((item) => (
          <NavbarItem key={item.label} lable={item.label} link={item.href} />
        ))}
        <div className="flex gap-2">
          <li>
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
          </li>
        </div>
      </ul>
    </nav>

  )
}

function MobileNavbar() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [counter, setCounter] = useState(localStorage.getItem("counter"))


  useEffect(() => {
    async function getCarts() {
      try {
        setCounter(localStorage.getItem("counter"))
      } catch (error) {
        console.log(error)
      }
    }

    getCarts()

    const handleCartChange = () => {
      getCarts();
    };

    window.addEventListener("cartChange", handleCartChange);

    return () => {
      window.removeEventListener("cartChange", handleCartChange);
    };
  }, [])

  async function logout() {
    try {
      await axios.get("/api/v1/auth/logout", {
        withCredentials: true,
      })
      setOpen((prev) => !prev)
      router.push("/login")
    } catch (error) {
      console.error((error))
    }
  }

  return (
    <div className="flex md:hidden justify-between items-center p-4">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold italic">Selera Pelajar</h1>
      </div>

      <div className="flex items-center gap-2">
        <Link href={"/carts"}
          className="w-full"
        >
          <Button variant="ghost" className="font-bold">
            <ShoppingBasket className="w-4 h-4" />
            {Number(counter) > 0 && counter}
          </Button>
        </Link>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant={"ghost"}
              size={"icon"}
            >
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[400px] sm:w-[540px]" side={"right"}>
            <div className="flex justify-center items-center mb-2 gap-2">
              <h1 className="text-2xl font-bold italic">Selera Pelajar</h1>
            </div>
            <div className="max-h-[850px] h-full flex flex-col justify-between items-center">
              <div className="w-full flex flex-col justify-center items-center gap-4">
                {mobileItems.map((item) => (
                  <NavbarItem key={item.label} lable={item.label} link={item.href} clickCallback={() => {
                    setOpen((prev) => !prev)
                  }} />
                ))}
              </div>
              <Link
                href={"/"}
                className="w-full"
                onClick={logout}
              >
                <Button variant={"destructive"} className="w-full">
                  Logout
                </Button>
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}

function NavbarItem({ lable, link, clickCallback }: { lable: string; link: string, clickCallback?: () => void }) {
  const currentPath = usePathname();
  const isActive = currentPath === link;


  return (
    <Link href={link}
      className="w-full"
      onClick={() => {
        if (clickCallback) clickCallback()
      }}
    >
      {isActive ? (
        <Button variant="secondary" className="font-bold w-full">
          {lable}
        </Button>
      ) : (
        <Button variant="ghost" className="w-full">{lable}</Button>
      )}
    </Link>
  );
}

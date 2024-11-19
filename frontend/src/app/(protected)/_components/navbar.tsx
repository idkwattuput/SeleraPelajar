"use client";

import { Badge } from "@/components/ui/badge";
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
import { Cart } from "@/types/cart";
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
  { label: "Recent Order", href: "/orders" },
  { label: "History Order", href: "/history-order" },
];

const mobileItems = [
  { label: "Home", href: "/home" },
  { label: "Recent Order", href: "/orders" },
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
  const axiosPrivate = useAxiosPrivate()
  const [cartCounter, setCartCounter] = useState(0)
  const [orderCounter, setOrderCounter] = useState(0)


  useEffect(() => {
    async function getCarts() {
      try {
        const response = await axiosPrivate.get("/api/v1/carts")
        setCartCounter(response.data.data.reduce((count: number, cart: Cart) => {
          return cart.CartItems.length > 0 ? count + 1 : count;
        }, 0))
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

  useEffect(() => {
    async function getCurrentOrders() {
      try {
        const response = await axiosPrivate.get("/api/v1/orders")
        setOrderCounter(response.data.data.length)
      } catch (error) {
        console.log(error)
      }
    }

    getCurrentOrders()

    const handleOrderChange = () => {
      getCurrentOrders();
    };

    window.addEventListener("orderChange", handleOrderChange);

    return () => {
      window.removeEventListener("orderChange", handleOrderChange);
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
            {Number(cartCounter) > 0 && cartCounter}
          </Button>
        </Link>
        {items.map((item) => (
          <NavbarItem key={item.label} lable={item.label} link={item.href} counter={orderCounter} />
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
  const axiosPrivate = useAxiosPrivate()
  const [counter, setCounter] = useState(0)


  useEffect(() => {
    async function getCarts() {
      try {
        const response = await axiosPrivate.get("/api/v1/carts")
        setCounter(response.data.data.reduce((count: number, cart: Cart) => {
          return cart.CartItems.length > 0 ? count + 1 : count;
        }, 0))
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

function NavbarItem({ lable, link, counter, clickCallback }: { lable: string; link: string, counter: number, clickCallback?: () => void }) {
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
        <Button variant="ghost" className="w-full">
          {lable}
          {lable === "Recent Order" && (
            counter > 0 && (
              <Badge>{counter}</Badge>
            )
          )}
        </Button>
      )}
    </Link>
  );
}

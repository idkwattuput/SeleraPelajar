"use client";

import { io } from "socket.io-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
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
import { Order } from "@/types/order";

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
  const BACKEND_URL = process.env.BACKEND_URL!
  const router = useRouter()
  const axiosPrivate = useAxiosPrivate()
  const [cartCounter, setCartCounter] = useState(0)
  const [orderCounter, setOrderCounter] = useState(0)

  async function requestNotificationPermission() {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Notification permission granted.');
    } else {
      console.log('Notification permission denied.');
    }
  }

  // Call this function when the user logs in or opens the page
  requestNotificationPermission();

  function showNotification(title: string, order: Order, options: { body: string, icon: string, tag: string }) {
    if (Notification.permission === 'granted') {
      const notification = new Notification(title, options);
      notification.onclick = (event) => {
        event.preventDefault();
        window.open(`/orders`, '_blank'); // Adjust the URL to your order page
      };
    }
  }

  function notifyOrderStatusUpdate(order: Order, status: string) {
    const notificationOptions = {
      body: `Your order has been ${status}!`, // Example: Confirmed, Completed, or Cancelled
      icon: '/favicon.ico', // Optional: A small icon for the notification
      tag: 'order-update', // Ensures only one notification per order
    };

    showNotification('Order Status Update', order, notificationOptions);
  }

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

  useEffect(() => {
    const socket = io(`${BACKEND_URL}`);
    socket.on("connect", () => {
      console.log("Connected to the server");
    });

    socket.on("updateOrder", (newData: Order) => {
      if (newData.status === "PREPARING") {
        notifyOrderStatusUpdate(newData, "confirm and on preparing")
      } else if (newData.status === "COMPLETED") {
        notifyOrderStatusUpdate(newData, "completed")
        setOrderCounter(prev => prev - 1)
      } else {
        notifyOrderStatusUpdate(newData, "cancelled")
        setOrderCounter(prev => prev - 1)
      }
    });

    return () => {
      socket.off("connect");
      socket.off("updateOrder");
      socket.disconnect();
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
    <>
      <DesktopNavbar cartCounter={cartCounter} orderCounter={orderCounter} logout={logout} />
      <MobileNavbar cartCounter={cartCounter} orderCounter={orderCounter} logout={logout} />
    </>
  );
}

interface Props {
  cartCounter: number
  orderCounter: number
  logout: () => void
}

function DesktopNavbar({ cartCounter, orderCounter, logout }: Props) {
  return (
    <nav className="font-poppins hidden p-4 md:flex justify-between items-center border-b border-muted drop-shadow-sm">
      <div className="flex items-center gap-2">
        <h1 className="md:text-2xl xl:text-3xl font-bold italic">Selera Pelajar</h1>
      </div>
      <ul className="flex items-center gap-8">
        {items.map((item) => (
          <NavbarItem key={item.label} lable={item.label} link={item.href} counter={orderCounter} />
        ))}
      </ul>
      <div className="flex gap-4">
        <Link href={"/carts"}>
          <Button variant="ghost" className="font-bold flex items-center">
            <ShoppingBasket />
            {Number(cartCounter) > 0 && cartCounter}
          </Button>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
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

function MobileNavbar({ cartCounter, orderCounter, logout }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="font-poppins flex md:hidden justify-between items-center p-4 border-b border-muted drop-shadow-sm">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold italic">Selera Pelajar</h1>
      </div>

      <div className="flex items-center gap-2">
        <Link href={"/carts"}
          className="w-full"
        >
          <Button variant="ghost" className="font-bold">
            <ShoppingBasket className="w-4 h-4" />
            {Number(cartCounter) > 0 && cartCounter}
          </Button>
        </Link>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant={"ghost"}
              size={"icon"}
              className="relative"
            >
              <Menu />
              {orderCounter > 0 && (
                <span className="text-xs absolute top-0 right-0">{orderCounter}</span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[400px] sm:w-[540px]" side={"right"}>
            <SheetHeader>
              <SheetTitle className="text-2xl italic">
                Selera Pelajar
              </SheetTitle>
            </SheetHeader>
            <div className="max-h-[850px] mt-4 h-full flex flex-col justify-between items-center">
              <div className="w-full flex flex-col justify-center items-center gap-4">
                {mobileItems.map((item) => (
                  <NavbarItem key={item.label} lable={item.label} link={item.href} counter={orderCounter} clickCallback={() => {
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

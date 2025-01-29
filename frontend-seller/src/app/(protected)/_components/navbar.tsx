"use client"

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CircleUser, ClipboardList, House, Menu, Store, Utensils } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { ReactNode, useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import useAxiosPrivate from "@/hooks/use-axios-private";
import { Order } from "@/types/order";
import { io } from "socket.io-client";

const mobileItems = [
  { label: "Dashboard", href: "/dashboard", icon: (<House />) },
  { label: "Order", href: "/orders", icon: (<ClipboardList />) },
  { label: "Cafe", href: "/cafe", icon: (<Store />) },
  { label: "Item", href: "/items", icon: (<Utensils />) },
];

export default function Navbar() {
  const BACKEND_URL = process.env.BACKEND_URL!
  const router = useRouter()
  const axiosPrivate = useAxiosPrivate()
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

  function showNotification(title: string, options: { body: string, icon: string, tag: string }) {
    if (Notification.permission === 'granted') {
      const notification = new Notification(title, options);
      notification.onclick = (event) => {
        event.preventDefault();
        window.open(`/orders`, '_blank'); // Adjust the URL to your order page
      };
    }
  }

  function notifyOrderStatusUpdate(status: string) {
    const notificationOptions = {
      body: status, // Example: Confirmed, Completed, or Cancelled
      icon: '/favicon.ico', // Optional: A small icon for the notification
      tag: 'order-update', // Ensures only one notification per order
    };

    showNotification('Order Status Update', notificationOptions);
  }

  useEffect(() => {
    async function getCurrentOrders() {
      try {
        const response = await axiosPrivate.get("/api/v1/orders/seller")
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

    socket.on("newOrder", (newData: Order) => {
      if (newData.status === "PENDING") {
        notifyOrderStatusUpdate(`New order ${newData.id.slice(0, 3)} has been placed.`)
      }
    });

    socket.on("updateOrder", (newData: Order) => {
      if (newData.status === "CANCELLED") {
        notifyOrderStatusUpdate(`Order ${newData.id.slice(0, 3)} has been cancelled`)
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
      <DesktopNavbar logout={logout} />
      <MobileNavbar orderCounter={orderCounter} logout={logout} />
    </>
  );
}

interface Props {
  logout: () => void
}

function DesktopNavbar({ logout }: Props) {
  return (
    <nav className="hidden lg:flex justify-between items-center p-4 border-b border-muted">
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

function MobileNavbar({ orderCounter, logout }: { orderCounter: number; logout: () => void }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="font-poppins flex lg:hidden justify-between items-center p-4 border-b border-muted">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold italic">Selera Pelajar</h1>
      </div>

      <div className="flex items-center gap-2">
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
                  <NavbarItem key={item.label} lable={item.label} link={item.href} counter={orderCounter} icon={item.icon} clickCallback={() => {
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

function NavbarItem({ lable, link, icon, counter, clickCallback }: { lable: string; link: string; icon: ReactNode; counter: number; clickCallback?: () => void }) {
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
        <Button variant="secondary" className="font-bold w-full flex items-center">
          {icon}
          {lable}
        </Button>
      ) : (
        <Button variant="ghost" className="w-full flex items-center">
          {icon}
          {lable}
          {lable === "Order" && (
            counter > 0 && (
              <Badge>{counter}</Badge>
            )
          )}
        </Button>
      )}
    </Link>
  );
}


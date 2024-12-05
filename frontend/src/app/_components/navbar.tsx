import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  Menu,
} from "lucide-react";
import Link from "next/link";

const items = [
  { label: "Home", href: "#home" },
  { label: "Feature", href: "#feature" },
  { label: "How It Works", href: "#how-it-work" },
];

const mobileItems = [
  { label: "Home", href: "#home" },
  { label: "Feature", href: "#feature" },
  { label: "How It Works", href: "#how-it-work" },
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
  return (
    <nav className="font-poppins hidden sticky top-0 z-10 py-4 px-32 md:flex justify-between items-center">
      <div className="flex items-center gap-2">
        <h1 className="md:text-2xl xl:text-3xl font-bold italic">Selera Pelajar</h1>
      </div>
      <ul className="flex items-center gap-8">
        {items.map((item) => (
          <NavbarItem key={item.label} lable={item.label} link={item.href} />
        ))}
      </ul>
      <ul className="flex items-center gap-4">
        <Link href={"/login"}>
          <Button>Sign In</Button>
        </Link>
        <Link href={"/register"}>
          <Button variant={"outline"}>Sign Up</Button>
        </Link>
      </ul>
    </nav>

  )
}

function MobileNavbar() {
  return (
    <div className="font-poppins flex md:hidden justify-between items-center p-4 border-b border-muted drop-shadow-sm">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold italic">Selera Pelajar</h1>
      </div>

      <div className="flex items-center gap-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant={"ghost"}
              size={"icon"}
              className="relative"
            >
              <Menu />
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
                  <NavbarItem key={item.label} lable={item.label} link={item.href} />
                ))}
              </div>
              <ul className="w-full flex flex-col items-center gap-4">
                <Link href={"/login"} className="w-full">
                  <Button className="w-full">Sign In</Button>
                </Link>
                <Link href={"/register"} className="w-full">
                  <Button variant={"outline"} className="w-full">Sign Up</Button>
                </Link>
              </ul>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}

function NavbarItem({ lable, link }: { lable: string; link: string }) {
  return (
    <Link href={link}
      className="w-full"
    >
      <Button variant="ghost" className="w-full">
        {lable}
      </Button>
    </Link>
  );
}


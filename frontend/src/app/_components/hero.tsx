import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="h-screen flex flex-col-reverse lg:flex-row justify-center lg:justify-between items-center px-32">
      <div>
        <h1 className="font-poppins text-2xl lg:text-4xl xl:text-6xl font-bold">Effortless Food & Drink Ordering for Students</h1>
        <p className="lg:mt-4 lg:text-xl max-w-[600px]">Browse cafes, discover menus, and order in just a few clicks-all without leaving your seat.</p>
        <div className="mt-4 flex items-center gap-4">
          <Link href={"/home"}>
            <Button size={"lg"}>Explore Cafes</Button>
          </Link>
          <Link href={"/login"}>
            <Button variant={"outline"} size={"lg"}>Login</Button>
          </Link>
        </div>
      </div>
      <Image
        src={"/food.svg"}
        alt="food image"
        width={"700"}
        height={"700"}
      />
    </div>
  )
}


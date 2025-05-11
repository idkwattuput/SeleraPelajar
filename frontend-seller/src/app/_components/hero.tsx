import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="h-screen w-full flex flex-col-reverse xl:flex-row justify-center xl:justify-between items-center px-4 md:px-6 lg:px-32 gap-8 xl:gap-0">
      <div className="xl:flex-1 flex flex-col justify-center items-center xl:justify-start xl:items-start">
        <h1 className="font-poppins text-2xl text-center xl:text-start lg:text-4xl xl:text-6xl font-bold">Effortless Food & Drink Ordering for Students</h1>
        <p className="xl:mt-4 text-sm sm:text-md md:text-lg text-center xl:text-start xl:text-xl max-w-[600px]">Browse cafes, discover menus, and order in just a few clicks-all without leaving your seat.</p>
        <div className="mt-4 flex justify-center xl:justify-start items-center gap-4">
          <Link href={"/home"}>
            <Button size={"lg"}>Explore Cafes</Button>
          </Link>
          <Link href={"/login"}>
            <Button variant={"outline"} size={"lg"}>Login</Button>
          </Link>
        </div>
      </div>
      <div className="xl:flex-shrink-0 w-full flex justify-center items-center xl:w-1/2 ">
        <Image
          src={"/food.svg"}
          alt="food image"
          width={"700"}
          height={"700"}
        />
      </div>
    </div>
  )
}



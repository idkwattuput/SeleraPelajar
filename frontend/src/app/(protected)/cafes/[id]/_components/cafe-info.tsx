import { Cafe } from "@/types/cafe"
import { MapPin } from "lucide-react"
import Image from "next/image"

interface Props {
  cafe: Cafe
}

export default function CafeInfo({ cafe }: Props) {
  const BACKEND_URL = process.env.BACKEND_URL!

  return (
    <div className="flex justify-start items-center gap-4">
      <Image
        src={`${BACKEND_URL}/cafes/${cafe.image}`}
        alt="cafe image"
        width={200}
        height={100}
        className="rounded-lg"
      />
      <div className="">
        <h1 className="text-3xl font-bold">{cafe.name}</h1>
        <p className="text-sm text-muted-foreground">{cafe.description}</p>
        <div className="flex items-center text-muted-foreground text-sm">
          <MapPin className="h-4 w-4" />{cafe.block}-{cafe.lot}
        </div>
      </div>
    </div>
  )
}


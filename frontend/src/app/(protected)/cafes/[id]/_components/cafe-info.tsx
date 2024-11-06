import { Cafe } from "@/types/cafe"

interface Props {
  cafe: Cafe
}

export default function CafeInfo({ cafe }: Props) {
  return (
    <div>
      <h1 className="text-3xl font-bold">{cafe.name}</h1>
      <div className="flex text-sm text-muted-foreground">
        <p>{cafe.description}</p>-
        <p>{cafe.block}</p>
        <p>{cafe.lot}</p>
      </div>
    </div>
  )
}


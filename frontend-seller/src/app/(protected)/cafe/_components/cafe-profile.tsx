import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Cafe } from "@/types/cafe";
import { Pencil } from "lucide-react";
import Image from "next/image";
import EditCafeDialog from "./edit-cafe-dialog"
import EditCafeImageDialog from "./edit-cafe-image-dialog";

interface Props {
  cafe: Cafe | null
  onChange: (updatedCafe: Cafe) => void
}

export default function CafeProfile({ cafe, onChange }: Props) {
  const BACKEND_URL = process.env.BACKEND_URL!

  if (!cafe) {
    return (
      <div>dingus</div>
    )
  }

  return (
    <div className="flex gap-10 mb-4">
      {cafe.image ? (
        <div className="relative">
          <Image
            src={`${BACKEND_URL}/cafes/${cafe.image}`}
            width={200}
            height={200}
            alt="cafeImage"
            className="rounded-lg max-h-[200px]"
          />
          <EditCafeImageDialog onChange={onChange}>
            <Button
              size={"icon"}
              variant={"secondary"}
              className="absolute rounded-full top-0 right-0"
            >
              <Pencil />
            </Button>
          </EditCafeImageDialog>
        </div>
      ) : (
        <Card>
          lol
        </Card>
      )}
      <div>
        <h1 className="text-3xl font-bold">{cafe.name}</h1>
        <p>{cafe.description}</p>
        <p className="text-muted-foreground mb-4">{cafe.block}-{cafe.lot}</p>
        <EditCafeDialog cafe={cafe} onChange={onChange}>
          <Button>Edit Cafe</Button>
        </EditCafeDialog>
      </div>
    </div>
  )
}


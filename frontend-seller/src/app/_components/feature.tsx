import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { BellRing, Fingerprint, Pizza, TimerOff } from "lucide-react";

export default function Feature() {
  return (
    <div className="py-10 px-4 md:px-6 lg:px-32 flex flex-col justify-center items-center">
      <h1 className="mb-4 text-center font-poppins text-4xl font-bold">Feature</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-col justify-center items-center gap-4">
            <Pizza className="w-8 h-8" />
            <CardTitle className="text-center">
              Explore menus from your favorite local cafes.
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="flex flex-col justify-center items-center gap-4">
            <BellRing className="w-8 h-8" />
            <CardTitle className="text-center">
              Get notified instantly when your order is ready.
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="flex flex-col justify-center items-center gap-4">
            <Fingerprint className="w-8 h-8" />
            <CardTitle className="text-center">
              Order food and drinks in just a few taps
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="flex flex-col justify-center items-center gap-4">
            <TimerOff className="w-8 h-8" />
            <CardTitle className="text-center">
              No queues, no hassle—focus on what matters.
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}


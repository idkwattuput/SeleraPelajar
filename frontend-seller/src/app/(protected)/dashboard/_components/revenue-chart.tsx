"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Revenue } from "../page"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Props {
  revenueSummary: Revenue[]
}

const chartConfig = {
  desktop: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function WeekRevenueChart({ revenueSummary }: Props) {
  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle>Weekly Revenue</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-[500px] w-full">
          <BarChart accessibilityLayer data={revenueSummary} width={500} height={300}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="revenue" fill="var(--color-desktop)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}


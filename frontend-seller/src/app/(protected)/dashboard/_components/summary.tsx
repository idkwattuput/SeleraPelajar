import SkeletonWrapper from "@/components/skeleton-wrapper";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Summary } from "@/types/summary";


interface Props {
  summary: Summary
  isLoading: boolean
}

export default function Summary({ summary, isLoading }: Props) {

  if (isLoading) {
    return (
      <SkeletonWrapper isLoading={isLoading}>
        <Card>
          <CardHeader>
            <CardTitle>Loading</CardTitle>
            <CardDescription>Loading</CardDescription>
          </CardHeader>
        </Card>
      </SkeletonWrapper>
    )
  }

  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <Card>
        <CardHeader>
          <CardDescription className="text-primary">Order Today</CardDescription>
          <CardTitle>{summary.order_today}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription className="text-primary">Revenue Today</CardDescription>
          <CardTitle>RM {Number(summary.revenue_today).toFixed(2)}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription className="text-primary">Order This Week</CardDescription>
          <CardTitle>{summary.order_week}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription className="text-primary">Most Popular Item</CardDescription>
          <CardTitle>{summary.popular_item?.name ? summary.popular_item.name : summary.popular_item}</CardTitle>
        </CardHeader>
      </Card>
    </div>
  )
}


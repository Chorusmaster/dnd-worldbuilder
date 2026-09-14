"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDashboard } from "@/app/dashboard/dashboard-context";

function Overview() {
  const dashboardContext = useDashboard();

  if (!dashboardContext.activeWorld) return null;
  const world = dashboardContext.activeWorld;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{world.name}</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Entities", 0],
          ["Locations", 0],
          ["Categories", 0],
          ["Members", 1],
        ].map(([title, value]) => (
          <Card className="min-h-32 min-w-48" key={title}>
            <CardHeader>
              <CardTitle className="text-sm font-medium">{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">{value}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>About this world</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {world.description ?? "No description yet."}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No recent activity.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Overview;
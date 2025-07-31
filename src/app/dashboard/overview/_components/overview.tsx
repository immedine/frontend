'use client';

// import { AreaGraph } from './area-graph';
// import { BarGraph } from './bar-graph';
import { useDashboard } from '@/hooks/use-dashboard';
// import { PieGraph } from './pie-graph';
// import { CalendarDateRangePicker } from '@/components/date-range-picker';
import PageContainer from '@/components/layout/page-container';
// import { RecentSales } from './recent-sales';
// import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LandmarkIcon, AlbumIcon, MapPinIcon, RouteIcon, User2Icon } from 'lucide-react';
export default function OverViewPage() {

  // const { data } = useDashboard();

  const statsData = {};

  return (
    <PageContainer scrollable>
      <div className="space-y-2">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Welcome
          </h2>
          {/* <div className="hidden items-center space-x-2 md:flex">
            <CalendarDateRangePicker />
            <Button>Download</Button>
          </div> */}
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>

          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Cities
                  </CardTitle>
                  <LandmarkIcon />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statsData.totalCity || 0}</div>

                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Stories
                  </CardTitle>
                  <AlbumIcon />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statsData.totalStory || 0}</div>

                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Routes</CardTitle>
                  <RouteIcon />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statsData.totalRoute || 0}</div>

                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Users
                  </CardTitle>
                  <User2Icon />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statsData.totalUser || 0}</div>

                </CardContent>
              </Card>
            </div>
            {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
              <div className="col-span-4">
                <BarGraph />
              </div>
              <Card className="col-span-4 md:col-span-3">
                <CardHeader>
                  <CardTitle>Recent Sales</CardTitle>
                  <CardDescription>
                    You made 265 sales this month.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentSales />
                </CardContent>
              </Card>
              <div className="col-span-4">
                <AreaGraph />
              </div>
              <div className="col-span-4 md:col-span-3">
                <PieGraph />
              </div>
            </div> */}
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}

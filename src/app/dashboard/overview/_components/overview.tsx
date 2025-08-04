'use client';

// import { AreaGraph } from './area-graph';
// import { BarGraph } from './bar-graph';
// import { useDashboard } from '@/hooks/use-dashboard';
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
import { dashboardService } from '@/services/dashboard.service';
import { CookingPot } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
export default function OverViewPage() {
  const pathname = usePathname();
  const [statsData, setStatsData] = useState({
    totalCategories: 0,
    totalMenu: 0
  })

  const fetchDashboardStats = async () => {
    const res = await dashboardService.getDashboard(pathname.split('/')[1]);
    if (res.data) {
      setStatsData({
        totalCategories: res.data.totalCategories || 0,
        totalMenu: res.data.totalMenu || 0
      });
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

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
                    Total Categories
                  </CardTitle>
                  <CookingPot />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statsData.totalCategories || 0}</div>

                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Menu
                  </CardTitle>
                  <CookingPot />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statsData.totalMenu || 0}</div>

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

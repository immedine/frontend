'use client';

import { notFound } from 'next/navigation';
import RouteForm from './route-form';
import { Route } from './route-tables/columns';
import { useRoute } from '@/hooks/content/use-route';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

type TRouteViewPageProps = {
  routeId: string;
};


export default function RouteViewPage({ routeId }: TRouteViewPageProps) {
  const { data: routeData, isLoading } = useRoute(routeId);
  const pageTitle = routeId === 'new' ? 'Create New Route' : 'Edit Route';
  console.log(routeId, "aa")
  if (routeId !== 'new' && !isLoading && !routeData) {
    notFound();
  }

  if (routeId !== 'new' && isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{pageTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Loading route details...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return <RouteForm initialData={routeData?.data} pageTitle={pageTitle} />;
}

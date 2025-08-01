"use client"

import { notFound } from 'next/navigation';
import CityForm from './city-form';

import { useCity } from '@/hooks/content/use-city';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

type TCityViewPageProps = {
  cityId: string;
};

export default function CityViewPage({ cityId }: TCityViewPageProps) {
  const { data: cityData, isLoading } = useCity(cityId);

  const pageTitle = cityId === 'new' ? 'Create New City' : 'Edit City';
  if (cityId !== 'new' && !isLoading && !cityData) {
    notFound();
  }

  if (cityId !== 'new' && isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{pageTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Loading city details...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }


  return <CityForm initialData={cityData?.data} cityId={cityId} pageTitle={pageTitle} />;
}

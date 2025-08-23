import { searchParamsCache, serialize } from '@/lib/searchparams';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { SearchParams } from 'nuqs/parsers';
import RestaurantForm from './_components/RestaurantForm';
import RestaurantListingPage from './_components/RestaurantList';

export const metadata = {
  title: 'Restaurants'
};

type pageProps = {
  searchParams: SearchParams;
};

export default async function Page({ searchParams }: pageProps) {
  searchParamsCache.parse(searchParams);
  const key = serialize({ ...searchParams });

  return (
    <PageContainer>
        <RestaurantListingPage />
    </PageContainer>
  );
}

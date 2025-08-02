import { searchParamsCache, serialize } from '@/lib/searchparams';
import { SearchParams } from 'nuqs/parsers';
import MenuDetailsPage from './_components/MenuDetails';

export const metadata = {
  title: 'Menu Details'
};

type pageProps = {
  searchParams: SearchParams;
};

export default async function Page({ searchParams }: pageProps) {
  searchParamsCache.parse(searchParams);
  const key = serialize({ ...searchParams });

  return (
    // <PageContainer>
      <div className="space-y-4">
          <MenuDetailsPage />
      </div>
    // </PageContainer>
  );
}

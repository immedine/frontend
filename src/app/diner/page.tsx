import { searchParamsCache, serialize } from '@/lib/searchparams';
import { SearchParams } from 'nuqs/parsers';
import MenuList from './_components/menuList';
import AppHeader from '@/components/layout/AppHeader';


export const metadata = {
  title: 'Menu'
};

type pageProps = {
  searchParams: SearchParams;
};

export default async function Page({ searchParams }: pageProps) {
  searchParamsCache.parse(searchParams);
  const key = serialize({ ...searchParams });

  return (
    // <PageContainer>
      <div className="">
        <AppHeader />
          <MenuList />
      </div>
    // </PageContainer>
  );
}

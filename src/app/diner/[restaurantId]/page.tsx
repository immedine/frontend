import { searchParamsCache, serialize } from '@/lib/searchparams';
import { SearchParams } from 'nuqs/parsers';
import MenuList from '../_components/menuList';
import AppHeader from '@/components/layout/AppHeader';


export const metadata = {
  title: 'Menu'
};

type pageProps = {
  searchParams: SearchParams;
};

export default async function Page(params: { restaurantId: string }) {
  return (
    // <PageContainer>
      <div className="">
        <AppHeader />
        <MenuList restaurantId={params?.params?.restaurantId} />
      </div>
    // </PageContainer>
  );
}

import MenuList from '../_components/menuList';
import AppHeader from '@/components/layout/AppHeader';

export const metadata = {
  title: 'Menu'
};

export default async function Page(params: { restaurantId: string }) {
  return (
    // <PageContainer>
      <div className="">
        <MenuList restaurantId={params?.params?.restaurantId} />
      </div>
    // </PageContainer>
  );
}

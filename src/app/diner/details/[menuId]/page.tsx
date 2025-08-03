import MenuDetailsPage from '../_components/MenuDetails';

export const metadata = {
  title: 'Menu Details'
};

export default async function Page(params: { menuId: string }) {

  return (
    // <PageContainer>
      <div className="space-y-4">
          <MenuDetailsPage menuId={params?.params?.menuId} />
      </div>
    // </PageContainer>
  );
}

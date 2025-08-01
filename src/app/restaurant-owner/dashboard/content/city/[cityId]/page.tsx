import { Metadata } from 'next';
import CityViewPage from '../_components/city-view-page';
import PageContainer from '@/components/layout/page-container';

type Props = {
  params: {
    cityId: string;
  };
};

export const metadata: Metadata = {
  title: 'City Details',
  description: 'City details page'
};

export default function CityDetailsPage({ params }: Props) {
  const pageTitle = params.cityId === 'new' ? 'Add City' : 'Edit City';

  return (
    <PageContainer>
      <CityViewPage cityId={params.cityId} pageTitle={pageTitle} />
    </PageContainer>
  );
}

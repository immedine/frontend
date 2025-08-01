import { searchParamsCache, serialize } from '@/lib/searchparams';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { SearchParams } from 'nuqs/parsers';
import QRCodeForm from './_components/qrComponent';
// import RestaurantForm from './_components/RestaurantForm';

export const metadata = {
  title: 'Restaurant Details'
};

type pageProps = {
  searchParams: SearchParams;
};

export default async function Page({ searchParams }: pageProps) {
  searchParamsCache.parse(searchParams);
  const key = serialize({ ...searchParams });

  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
        <Heading
          title="Generate QR"
          description="Generate your QR code"
        />
      </div>
      <Separator />
      <QRCodeForm />
      </div>
    </PageContainer>
  );
}

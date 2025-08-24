import { searchParamsCache, serialize } from '@/lib/searchparams';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { SearchParams } from 'nuqs/parsers';
import QRCodeForm from '@/app/print-qr/_components/qrComponent';

export const metadata = {
  title: 'Restaurant Details'
};

type pageProps = {
  searchParams: SearchParams;
};

export default async function Page({ searchParams }: pageProps) {
  searchParamsCache.parse(searchParams);
  const key = serialize({ ...searchParams });
  console.log("key ", key)

  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
        <Heading
          title="Print QR"
          description="Print your QR code"
        />
      </div>
      <Separator />
      <QRCodeForm fromAdmin={true} />
      </div>
    </PageContainer>
  );
}

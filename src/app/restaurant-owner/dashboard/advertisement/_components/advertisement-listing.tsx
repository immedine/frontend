import { searchParamsCache } from '@/lib/searchparams';
import { DataTable } from '@/components/ui/table/data-table';
import { Advertisement, columns } from './advertisement-tables/columns';

const SAMPLE_ADVERTISEMENTS: Advertisement[] = [
  {
    id: '1',
    type: 'image',
    media: 'https://example.com/ad1.jpg',
    createdAt: new Date()
  },
  {
    id: '2',
    type: 'video',
    media: 'https://example.com/ad2.mp4',
    createdAt: new Date()
  },
  {
    id: '3',
    type: 'audio',
    media: 'https://example.com/ad3.mp3',
    languageRef: 'en',
    createdAt: new Date()
  }
];

export default async function AdvertisementListingPage() {
  const page = Number(searchParamsCache.get('page')) || 1;
  const search = searchParamsCache.get('q') || '';
  const pageLimit = Number(searchParamsCache.get('limit')) || 10;

  let filteredAds = [...SAMPLE_ADVERTISEMENTS];

  if (search) {
    const searchLower = search.toLowerCase();
    filteredAds = filteredAds.filter(
      (ad) =>
        ad.type.toLowerCase().includes(searchLower) ||
        (ad.languageRef && ad.languageRef.toLowerCase().includes(searchLower))
    );
  }

  const total = filteredAds.length;
  const startIndex = (page - 1) * pageLimit;
  const endIndex = startIndex + pageLimit;
  const paginatedAds = filteredAds.slice(startIndex, endIndex);

  return <DataTable columns={columns} data={paginatedAds} totalItems={total} />;
}

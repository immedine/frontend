import { notFound } from 'next/navigation';
import AdvertisementForm from './advertisement-form';
import { Advertisement } from './advertisement-tables/columns';

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

type TAdvertisementViewPageProps = {
  advertisementId: string;
};

export default async function AdvertisementViewPage({
  advertisementId
}: TAdvertisementViewPageProps) {
  let advertisement = null;
  let pageTitle = 'Create New Advertisement';

  if (advertisementId !== 'new') {
    advertisement = SAMPLE_ADVERTISEMENTS.find((a) => a.id === advertisementId);
    if (!advertisement) {
      notFound();
    }
    pageTitle = `Edit Advertisement`;
  }

  return (
    <AdvertisementForm initialData={advertisement} pageTitle={pageTitle} />
  );
}

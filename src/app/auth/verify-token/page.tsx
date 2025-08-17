import { Metadata } from 'next';
import VerifyTokenView from './_components/verify-token-view';

export const metadata: Metadata = {
  title: 'Verify Token',
  description: 'Verify your token'
};

export default function VerifyTokenPage() {
  return <VerifyTokenView />;
}

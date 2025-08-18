import { Metadata } from 'next';
import ImgToText from './_components/imgToText';

export const metadata: Metadata = {
  title: 'Img to text',
  description: ''
};

export default function SignInPage() {
  return <ImgToText />;
}

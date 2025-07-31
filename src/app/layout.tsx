import { Metadata } from 'next';
import { Poppins, Nunito } from 'next/font/google';
import { Providers } from '@/components/providers';
import NextTopLoader from 'nextjs-toploader';
import './globals.css';

export const metadata: Metadata = {
  title: 'Roods Admin',
  description: 'Admin panel for Roods'
};
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap'
});

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-nunito',
  display: 'swap'
});
export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${nunito.variable} overflow-hidden`}
      suppressHydrationWarning
    >
      <body>
        <Providers>
          {/* <NextTopLoader /> */}
          {children}
        </Providers>
      </body>
    </html>
  );
}

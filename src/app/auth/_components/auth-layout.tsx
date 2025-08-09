'use client';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  backButtonLabel?: string;
  backButtonHref?: string;
  showTerms?: boolean;
}

export default function AuthLayout({
  children,
  title,
  description,
  backButtonLabel,
  backButtonHref,
  showTerms = false
}: AuthLayoutProps) {
  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      {backButtonHref && (
        <Link
          href={backButtonHref}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'absolute right-4 top-4 font-nunito md:right-8 md:top-8'
          )}
        >
          {backButtonLabel}
        </Link>
      )}
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0">
          <Image
            src="/bg-auth.jpeg"
            alt="bg"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
      <div className="flex h-full items-center p-4 lg:p-8 overflow-y-auto">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col items-center space-y-2 text-center">
            <Image alt="logo" src="/text-logo.png" width={200} height={200} />
            <h1 className="font-poppins text-2xl font-semibold tracking-tight">
              {title}
            </h1>
            <p className="font-nunito text-sm text-muted-foreground">
              {description}
            </p>
          </div>
          {children}
          {false && (
            <p className="px-8 text-center font-nunito text-sm text-muted-foreground">
              By clicking continue, you agree to our{' '}
              <Link
                href="/terms"
                className="font-medium underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link
                href="/privacy"
                className="font-medium underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

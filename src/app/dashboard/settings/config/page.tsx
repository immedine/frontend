import { Metadata } from 'next';
import GlobalConfigForm from './_components/global-config-form';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';

export const metadata: Metadata = {
  title: 'Global Configuration',
  description: 'Manage global app settings'
};

export default function GlobalConfigPage() {
  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title="Global Configuration"
            description="Manage contact information and app URLs"
          />
        </div>
        <Separator />
        <GlobalConfigForm />
      </div>
    </PageContainer>
  );
}

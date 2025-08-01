'use client';

import { notFound } from 'next/navigation';
import StoryForm from './story-form';
import { useStory } from '@/hooks/content/use-story';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

type TStoryViewPageProps = {
  storyId: string;
};

export default function StoryViewPage({ storyId }: TStoryViewPageProps) {
  const { data: storyData, isLoading } = useStory(storyId);
  const pageTitle = storyId === 'new' ? 'Create New Story' : 'Edit Story';

  if (storyId !== 'new' && !isLoading && !storyData) {
    notFound();
  }

  // Show loading state
  if (storyId !== 'new' && isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{pageTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Loading story details...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return <StoryForm initialData={storyData?.data} pageTitle={pageTitle} />;
}

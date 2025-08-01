'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { DragHandleDots2Icon } from '@radix-ui/react-icons';
import { Plus, Search, X, MapPin } from 'lucide-react';
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { useState, useEffect, useMemo } from 'react';
import { CSS } from '@dnd-kit/utilities';
import { useStories } from '@/hooks/content/use-story';

interface Story {
  _id: string;
  name: string;
  fullAddress: {
    location: {
      coordinates: [number, number];
    };
    address: string;
  };
}

interface StorySelectorProps {
  value?: string[];
  onChange: (storyIds: string[]) => void;
  defaultValue?: Story[];
}

function SortableStory({ story }: { story: Story }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: story._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 rounded-md border bg-card p-3"
    >
      <div {...attributes} {...listeners}>
        <DragHandleDots2Icon className="h-5 w-5 cursor-grab" />
      </div>
      <div className="flex flex-1 items-center gap-2">
        <MapPin className="h-4 w-4" />
        <span className="flex-1">{story.fullAddress.address}</span>
        <span className="mr-12 text-xs text-muted-foreground">
          {story.fullAddress.location.coordinates[0].toFixed(4)},{' '}
          {story.fullAddress.location.coordinates[1].toFixed(4)}
        </span>
      </div>
    </div>
  );
}

export function StorySelector({
  value = [],
  onChange,
  defaultValue = []
}: StorySelectorProps) {
  const [selectedStoryIds, setSelectedStoryIds] = useState<string[]>(value);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    data: storiesData,
    isLoading,
    error
  } = useStories({
    skip: 0,
    limit: 0,
   
  });

  console.log('Stories API Response in component:', {
    success: storiesData?.success,
    total: storiesData?.data?.total,
    count: storiesData?.data?.data?.length,
    data: storiesData?.data?.data
  });

  // Get all available stories
  const availableStories = useMemo(() => {
    const stories = storiesData?.data?.data || [];
    console.log('Available stories:', stories.length);
    return stories;
  }, [storiesData]);

  // Get currently selected stories
  const selectedStories = useMemo(() => {
    console.log('Finding stories for IDs:', selectedStoryIds);
    // Find full story objects for selected IDs
    return selectedStoryIds
      .map((id) => {
        const story = availableStories.find((s) => s._id === id);
        console.log(`Story for ID ${id}:`, story);
        return story;
      })
      .filter((story): story is Story => !!story);
  }, [selectedStoryIds, availableStories]);

  // Filter stories for the dialog
  const filteredStories = useMemo(() => {
    return availableStories.filter((story) => {
      const address = story.fullAddress?.address?.toLowerCase() || '';
      const addressMatch = address.includes(searchQuery.toLowerCase());
      const notSelected = !selectedStoryIds.includes(story._id);
      return addressMatch && notSelected;
    });
  }, [availableStories, searchQuery, selectedStoryIds]);

  // Update selectedStoryIds when value prop changes
  useEffect(() => {
    setSelectedStoryIds(value);
  }, [value]);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const handleSelect = (story: Story) => {
    const newStoryIds = [...selectedStoryIds, story._id];
    setSelectedStoryIds(newStoryIds);
    onChange(newStoryIds);
    setIsDialogOpen(false);
  };

  const handleRemove = (id: string) => {
    const newStoryIds = selectedStoryIds.filter((storyId) => storyId !== id);
    setSelectedStoryIds(newStoryIds);
    onChange(newStoryIds);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSelectedStoryIds((items) => {
        const oldIndex = items.findIndex((item) => item === active.id);
        const newIndex = items.findIndex((item) => item === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        onChange(newItems);
        return newItems;
      });
    }
  };

  return (
    <div className="space-y-4">
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <SortableContext
          items={selectedStoryIds}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {isLoading ? (
              <div className="text-center text-muted-foreground">
                Loading stories...
              </div>
            ) : selectedStories.length > 0 ? (
              selectedStories.map((story) => (
                <div key={story._id} className="group relative">
                  <SortableStory story={story} />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemove(story._id)}
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground">
                No stories selected
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Story to Route
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Story to Route</DialogTitle>
          </DialogHeader>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by address..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="max-h-[400px] space-y-2 overflow-y-auto">
            {isLoading ? (
              <div className="py-4 text-center">Loading stories...</div>
            ) : error ? (
              <div className="py-4 text-center text-destructive">
                Error loading stories. Please try again.
              </div>
            ) : availableStories.length > 0 ? (
              filteredStories.length > 0 ? (
                filteredStories.map((story) => (
                  <Button
                    key={story._id}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleSelect(story)}
                  >
                    <div className="flex w-full items-center gap-2">
                      <MapPin className="h-4 w-4 shrink-0" />
                      <span className="truncate">
                        {story.fullAddress.address}
                      </span>
                      {story.fullAddress?.location?.coordinates && (
                        <span className="ml-auto whitespace-nowrap text-xs text-muted-foreground">
                          {story.fullAddress.location.coordinates[0].toFixed(4)}
                          ,{' '}
                          {story.fullAddress.location.coordinates[1].toFixed(4)}
                        </span>
                      )}
                    </div>
                  </Button>
                ))
              ) : (
                <div className="py-4 text-center text-muted-foreground">
                  {searchQuery
                    ? 'No stories found matching your search'
                    : 'No stories available at this location'}
                </div>
              )
            ) : (
              <div className="py-4 text-center text-muted-foreground">
                No stories available
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

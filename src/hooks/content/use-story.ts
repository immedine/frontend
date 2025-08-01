'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  storyService,
  StoryListParams,
  AddStoryData
} from '@/services/story.service';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function useStories(params: StoryListParams) {
  return useQuery({
    queryKey: ['stories', params],
    queryFn: async () => {
      try {
        const response = await storyService.getStories(params);
        return response;
      } catch (error) {
        console.error('Error fetching stories:', error);
        throw error;
      }
    }
  });
}

export function useStoriesBySortAndFilter(params: StoryListParams) {
  return useQuery({
    queryKey: ['stories', params],
    queryFn: async () => {
      try {
        const response = await storyService.getStoriesBySortAndFilter(params);
        return response;
      } catch (error) {
        console.error('Error fetching stories:', error);
        throw error;
      }
    }
  });
}

export function useStory(id: string) {
  return useQuery({
    queryKey: ['stories', id],
    queryFn: () => storyService.getStory(id),
    enabled: !!id && id !== 'new'
  });
}

export function useAddStory() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: storyService.addStory,
    onSuccess: () => {
      toast.success('Story added successfully');
      queryClient.invalidateQueries({ queryKey: ['stories'] });
      router.push('/dashboard/content/story');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to add story');
    }
  });
}

export function useUpdateStory(id: string) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddStoryData) => storyService.updateStory(id, data),
    onSuccess: () => {
      toast.success('Story updated successfully');
      queryClient.invalidateQueries({ queryKey: ['stories'] });
      router.back();
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update story');
    }
  });
}

export function useDeleteStory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: storyService.deleteStory,
    onSuccess: () => {
      toast.success('Story deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['stories'] });
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to delete story');
    }
  });
}

export function useBulkUploadStory() {
  return useMutation({
    mutationFn: (data: any) => storyService.bulkUploadStory(data),
    onSuccess: () => {
      toast.success('File uploaded successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to upload');
    }
  });
}

export function useStoryFiles(params: StoryListParams) {
  return useQuery({
    queryKey: ['storyFiles', params],
    queryFn: async () => {
      try {
        const response = await storyService.getStoryFiles();
        return response;
      } catch (error) {
        console.error('Error fetching story files:', error);
        throw error;
      }
    }
  });
}

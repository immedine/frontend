'use client';

import { useMutation } from '@tanstack/react-query';
import { uploadService } from '@/services/upload.service';
import { toast } from 'sonner';

export function useImageUpload() {
  return useMutation({
    mutationFn: uploadService.uploadImage,
    // onError: (error: any) => {
    //   toast.error(error?.message || 'Failed to upload image');
    // }
  });
}

export function useAudioUpload() {
  return useMutation({
    mutationFn: uploadService.uploadAudio,
    // onError: (error: any) => {
    //   toast.error(error?.message || 'Failed to upload audio');
    // }
  });
}

export function useVideoUpload() {
  return useMutation({
    mutationFn: uploadService.uploadVideo,
    // onError: (error: any) => {
    //   toast.error(error?.message || 'Failed to upload video');
    // }
  });
}

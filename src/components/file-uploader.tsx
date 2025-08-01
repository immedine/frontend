'use client';

import { CrossIcon,XIcon, UploadIcon, ImageIcon, VideoIcon, RadioIcon } from 'lucide-react';
import Image from 'next/image';
import * as React from 'react';
import Dropzone, { type FileRejection } from 'react-dropzone';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useControllableState } from '@/hooks/use-controllable-state';
import { cn, formatBytes } from '@/lib/utils';

interface FileUploaderProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: File[];
  onValueChange?: React.Dispatch<React.SetStateAction<File[]>>;
  onUpload?: (files: File[]) => Promise<void>;
  progresses?: Record<string, number>;
  accept?: {
    'image/*'?: string[];
    'video/*'?: string[];
    'audio/*'?: string[];
  };
  maxSize?: number;
  maxFiles?: number;
  multiple?: boolean;
  disabled?: boolean;
}

export function FileUploader({
  value: valueProp,
  onValueChange,
  onUpload,
  progresses,
  accept = { 'image/*': [] },
  maxSize = 1024 * 1024 * 50, // 50MB default
  maxFiles = 1,
  multiple = false,
  disabled = false,
  className,
  ...props
}: FileUploaderProps) {
  const [files, setFiles] = useControllableState({
    prop: valueProp,
    onChange: onValueChange,
  });

  const onDrop = React.useCallback(
    async (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (!multiple && maxFiles === 1 && acceptedFiles.length > 1) {
        toast.error('Cannot upload more than 1 file');
        return;
      }

      if ((files?.length ?? 0) + acceptedFiles.length > maxFiles) {
        toast.error(`Cannot upload more than ${maxFiles} files`);
        return;
      }

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
        })
      );

      const updatedFiles = files ? [...files, ...newFiles] : newFiles;
      setFiles(updatedFiles);

      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ file, errors }) => {
          errors.forEach(error => {
            switch (error.code) {
              case 'file-too-large':
                toast.error(`File ${file.name} is too large. Max size: ${formatBytes(maxSize)}`);
                break;
              case 'file-invalid-type':
                toast.error(`File ${file.name} has an invalid file type`);
                break;
              default:
                toast.error(`File ${file.name} was rejected`);
            }
          });
        });
      }

      if (onUpload && updatedFiles.length > 0 && updatedFiles.length <= maxFiles) {
        try {
          await onUpload(updatedFiles);
        } catch (error) {
          toast.error('Failed to upload files');
        }
      }
    },
    [files, maxFiles, multiple, onUpload, setFiles, maxSize]
  );

  const onRemove = React.useCallback((index: number) => {
    if (!files) return;
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
  }, [files, setFiles]);

  React.useEffect(() => {
    return () => {
      if (!files) return;
      files.forEach((file) => {
        if (isFileWithPreview(file)) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [files]);

  const renderFilePreview = (file: File & { preview?: string }) => {
    if (file.type.startsWith('image/') && file.preview) {
      return (
        <img
          src={URL.createObjectURL(file)}
          alt={file.name}
          width={48}
          height={48}
          className="aspect-square rounded-md object-cover"
        />
      );
    } else if (file.type.startsWith('video/')) {
      return <VideoIcon className="size-12 text-muted-foreground" />;
    } else if (file.type.startsWith('audio/')) {
      return <RadioIcon className="size-12 text-muted-foreground" />;
    }
    return <ImageIcon className="size-12 text-muted-foreground" />;
  };

  const isDisabled = disabled || (files?.length ?? 0) >= maxFiles;

  return (
    <div className="relative flex flex-col gap-6 overflow-hidden">
      <Dropzone
        onDrop={onDrop}
        accept={accept}
        maxSize={maxSize}
        maxFiles={maxFiles}
        multiple={multiple}
        disabled={isDisabled}
      >
        {({ getRootProps, getInputProps, isDragActive }) => (
          <div
            {...getRootProps()}
            className={cn(
              'group relative grid h-52 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-5 py-2.5 text-center transition hover:bg-muted/25',
              'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              isDragActive && 'border-muted-foreground/50',
              isDisabled && 'pointer-events-none opacity-60',
              className
            )}
            {...props}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="rounded-full border border-dashed p-3">
                <UploadIcon className="size-7 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <p className="font-medium text-muted-foreground">
                  {isDragActive ? 'Drop files here' : 'Drag files here or click to browse'}
                </p>
                <p className="text-sm text-muted-foreground/70">
                  {multiple 
                    ? `Upload up to ${maxFiles} files (max ${formatBytes(maxSize)} each)`
                    : `Upload a file (max ${formatBytes(maxSize)})`}
                </p>
              </div>
            </div>
          </div>
        )}
      </Dropzone>

      {files?.length ? (
        <ScrollArea className="h-fit w-full px-3">
          <div className="max-h-48 space-y-4">
            {files.map((file, index) => (
              <div key={index} className="relative flex items-center space-x-4">
                <div className="flex flex-1 items-center space-x-4">
                  {renderFilePreview(file)}
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatBytes(file.size)}
                    </p>
                    {progresses?.[file.name] && (
                      <Progress value={progresses[file.name]} className="h-1" />
                    )}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="size-7"
                  onClick={() => onRemove(index)}
                >
                  <XIcon className="size-4" />
                  <span className="sr-only">Remove file</span>
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      ) : null}
    </div>
  );
}

function isFileWithPreview(file: File): file is File & { preview: string } {
  return 'preview' in file && typeof file.preview === 'string';
}
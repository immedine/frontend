'use client';
// @ts-ignore
import { Icons } from '@/components/icons';
import { FileUploader } from '@/components/file-uploader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import * as z from 'zod';
import { Story } from '@/services/story.service';
import { Textarea } from '@/components/ui/textarea';
import {
  Plus,
  X,
  AudioLinesIcon,
  MapPin,
  Check,
  VideoIcon,
  Loader2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import {
  useImageUpload,
  useAudioUpload,
  useVideoUpload
} from '@/hooks/common/use-upload';
import { useAddStory, useUpdateStory } from '@/hooks/content/use-story';
import { useLanguages } from '@/hooks/settings/use-language';
import { useCategories } from '@/hooks/settings/use-category';

import { useAllCities } from '@/hooks/content/use-city';
import { toast } from 'sonner';
import { MapInputWrapper } from './map-input-wrapper';
import { MultiSelect } from '@/components/ui/multi-select';
import Image from 'next/image';
import React, { useEffect } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import dynamic from 'next/dynamic';
import { MapWithSearch } from './mapbox-map-input';

const CKEditorComp = dynamic(() => import('@/components/ck-editor'), {
  ssr: false
});

const MAX_FILE_SIZE = 50000000;
const ACCEPTED_IMAGE_TYPES = ['.jpg', '.jpeg', '.png', '.webp'];
const ACCEPTED_VIDEO_TYPES = ['.mp4', '.webm'];
const ACCEPTED_AUDIO_TYPES = ['.mp3', '.wav'];

interface StoryFormProps {
  initialData: Story | null;
  pageTitle: string;
}

const formSchema = z.object({
  uniqueId: z.string().min(1, 'Unique ID is required'),
  cityRef: z.string().min(1, 'City is required'),
  images: z.array(z.string().url('Invalid image URL')),
  newImages: z
    .array(
      z
        .custom<File>(
          (value) => value instanceof File,
          'Please upload a valid image file'
        )
        .refine((file) => file.size <= MAX_FILE_SIZE, {
          message: 'File size must be less than 5MB'
        })
        .refine(
          (file) =>
            ACCEPTED_IMAGE_TYPES.some((type) =>
              file.name.toLowerCase().endsWith(type)
            ),
          {
            message: 'Only .jpg, .jpeg, .png, .webp files are accepted'
          }
        )
    )
    .optional(),
  fullAddress: z.object({
    address: z.string().min(1, 'Address is required'),
    location: z.object({
      type: z.literal('Point').optional(),
      coordinates: z.tuple([z.number(), z.number()]).optional()
    })
  }),
  languageDetails: z
    .array(
      z.object({
        languageRef: z.string().min(1, 'Language is required'),
        name: z.string().min(1, 'Name is required'),
        description: z.string().min(1, 'Description is required'),
        fullDescription: z.string().optional(),
        audioSegment: z
          .union([
            z.array(z.string().url('Invalid audio URL')),
            z.array(
              z
                .custom<File>(
                  (value) => value instanceof File,
                  'Please upload a valid audio file'
                )
                .refine(
                  (file) => file instanceof File && file.size <= MAX_FILE_SIZE,
                  {
                    message: 'File size must be less than 5MB'
                  }
                )
                .refine(
                  (file) =>
                    file instanceof File &&
                    ACCEPTED_AUDIO_TYPES.some((type) =>
                      file.name.toLowerCase().endsWith(type)
                    ),
                  { message: 'Only .mp3 and .wav files are accepted' }
                )
            )
          ])
          .optional(),
        videoSegment: z
          .union([
            z.array(z.string().url('Invalid video URL')),
            z.array(
              z
                .custom<File>(
                  (value) => value instanceof File,
                  'Please upload a valid video file'
                )
                .refine(
                  (file) => file instanceof File && file.size <= MAX_FILE_SIZE,
                  {
                    message: 'File size must be less than 5MB'
                  }
                )
                .refine(
                  (file) =>
                    file instanceof File &&
                    ACCEPTED_VIDEO_TYPES.some((type) =>
                      file.name.toLowerCase().endsWith(type)
                    ),
                  { message: 'Only .mp4 and .webm files are accepted' }
                )
            )
          ])
          .optional()
      })
    )
    .refine((details) => details.length > 0, {
      message: 'At least one language detail is required'
    }),
  otherDetails: z.object({
    openingHours: z.string(),
    additionalInfo: z.string(),
    ticketPrice: z.string()
  }),
  storySource: z.object({
    source: z.string(),
    photos: z.string()
  }),
  businessInfo: z.object({
    logo: z.union([
      z.string(),
      z.array(z.string().url('Invalid logo URL')),
      z.array(
        z
          .custom<File>(
            (value) => value instanceof File,
            'Please upload a valid file'
          )
          .refine(
            (file) => file instanceof File && file.size <= MAX_FILE_SIZE,
            {
              message: 'File size must be less than 5MB'
            }
          )
          .refine(
            (file) =>
              file instanceof File &&
              ACCEPTED_IMAGE_TYPES.some((type) =>
                file.name.toLowerCase().endsWith(type)
              ),
            { message: 'Only .jpg, .jpeg, and .png files are accepted' }
          )
      )
    ]),
    website: z.string(),
    couponsDiscounts: z.string().optional(),
    ticketSales: z.string().optional(),
    operatingHours: z.string()
  }),
  isNew: z.boolean(),
  hideFromApp: z.boolean(),
  timeForNew: z.date().optional(),
  categoryRefs: z.string().min(1, 'Category is required'),
});

type FormValues = z.infer<typeof formSchema>;

const getFileNameFromUrl = (url: string) => {
  return url.split('/').pop() || url;
};

export default function StoryForm({ initialData, pageTitle }: StoryFormProps) {
  const { mutate: addStory, isPending: isAddPending } = useAddStory();
  const { mutate: uploadImage, isPending: isImageUploading } = useImageUpload();
  const { mutate: uploadAudio, isPending: isAudioUploading } = useAudioUpload();
  const { mutate: uploadVideo, isPending: isVideoUploading } = useVideoUpload();
  const { mutate: updateStory, isPending: isUpdatePending } = useUpdateStory(
    initialData?._id || ''
  );

  const [defaultCoordinates, setDefaultCoordinate] = React.useState([]);
  const [isLocationDialogOpen, setIsLocationDialogOpen] = React.useState(false);

  const { data: languagesData, isLoading } = useLanguages({
    skip: 0,
    limit: 0,
    filters: {},
    sortConfig: {}
  });
  const { data: categoriesData } = useCategories({
    skip: 0,
    limit: 0,
    filters: {},
    sortConfig: {}
  });
  const { data: citiesData } = useAllCities();

  const [displayImages, setDisplayImages] = React.useState<string[]>(
    initialData?.images || []
  );
  const [displayBusinessLogo, setDisplayBusinessLogo] = React.useState<string>(
    initialData?.businessInfo?.logo || ''
  );

  const englishLanguage = languagesData?.data?.data?.find(
    (lang) => lang.name.toLowerCase() === 'english'
  );

  console.log('englishLanguage', englishLanguage?._id);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      uniqueId: initialData?.uniqueId || '',
      cityRef: initialData?.cityRef._id || undefined,
      images: initialData?.images || [],
      fullAddress: {
        address: '',
        location: {
          type: 'Point',
          coordinates: []
        }
      },
      languageDetails: initialData?.languageDetails
        ? initialData.languageDetails.map((detail) => ({
          languageRef: detail.languageRef?._id || detail.languageRef || '',
          name: detail.name || '',
          description: detail.description || '',
          fullDescription: detail.fullDescription || '',
          audioSegment: [],
          videoSegment: []
        }))
        : [{
          languageRef: undefined,
          name: '',
          description: '',
          fullDescription: '',
          audioSegment: [],
          videoSegment: []
        }],
      otherDetails: {
        openingHours: initialData?.otherDetails?.openingHours || '',
        additionalInfo: initialData?.otherDetails?.additionalInfo || '',
        ticketPrice: initialData?.otherDetails?.ticketPrice || ''
      },
      storySource: {
        source: initialData?.storySource?.source || '',
        photos: initialData?.storySource?.photos || ''
      },
      businessInfo: {
        logo: initialData?.businessInfo?.logo || '',
        website: initialData?.businessInfo?.website || '',
        couponsDiscounts: initialData?.businessInfo?.couponsDiscounts || '',
        ticketSales: initialData?.businessInfo?.ticketSales || '',
        operatingHours: initialData?.businessInfo?.operatingHours || ''
      },
      isNew: initialData?.isNewStory || false,
      hideFromApp: initialData?.hideFromApp || false,
      timeForNew: initialData?.timeForNew
        ? new Date(initialData.timeForNew)
        : undefined,
      categoryRefs: initialData?.categoryRefs && initialData?.categoryRefs.length ? initialData?.categoryRefs[0]._id : undefined
    }
  });

  const fullAddress = useWatch({
    control: form.control,
    name: 'fullAddress'
  });

  useEffect(() => {
    if (initialData) {
      setDisplayImages(initialData.images || []);

      setDisplayBusinessLogo(initialData.businessInfo?.logo || '');

      form.reset({
        uniqueId: initialData.uniqueId,
        cityRef: initialData.cityRef._id,
        images: initialData?.images || [],
        fullAddress: {
          address: initialData.fullAddress?.address || '',
          location: {
            type: 'Point',
            coordinates: initialData.fullAddress?.location?.coordinates || [
              0, 0
            ]
          }
        },
        languageDetails: initialData.languageDetails.map((detail) => ({
          languageRef: detail.languageRef?._id || detail.languageRef || '',
          name: detail.name || '',
          description: detail.description || '',
          fullDescription: detail.fullDescription || '',
          audioSegment: [],
          videoSegment: []
        })),
        otherDetails: initialData.otherDetails,
        storySource: {
          source: initialData.storySource.source,
          photos: initialData.storySource.photos
        },
        businessInfo: {
          logo: initialData.businessInfo?.logo || '',
          website: initialData.businessInfo.website,
          couponsDiscounts: initialData.businessInfo.couponsDiscounts,
          ticketSales: initialData.businessInfo.ticketSales,
          operatingHours: initialData.businessInfo.operatingHours
        },
        isNew: initialData.isNewStory,
        hideFromApp: initialData.hideFromApp,
        timeForNew: initialData.timeForNew
          ? new Date(initialData.timeForNew)
          : undefined,
        categoryRefs: initialData.categoryRefs && initialData.categoryRefs.length ? initialData.categoryRefs[0]._id : ""
      });
    }
  }, [initialData, form]);

  // useEffect(() => {
  //   if (englishLanguage?._id && !initialData) {
  //     const currentValues = form.getValues();
  //     form.reset({
  //       ...currentValues,
  //       languageDetails: [
  //         {
  //           languageRef: englishLanguage._id,
  //           name: '',
  //           description: '',
  //           fullDescription: '',
  //           audioSegment: [],
  //           videoSegment: []
  //         }
  //       ]
  //     });
  //   }
  // }, [englishLanguage, form, initialData]);

  const uploadFiles = async (files: File[], uploadFn: typeof uploadImage) => {
    console.log('Starting file upload for:', files?.length, 'files');
    if (!Array.isArray(files) || files.length === 0) return [];

    const results: string[] = [];

    try {
      // Upload files sequentially
      for (const file of files) {
        console.log('Uploading file:', file.name);
        const result = await new Promise<string>((resolve, reject) => {
          uploadFn(file, {
            onSuccess: (response: { success: boolean; data: string }) => {
              console.log('Upload success for:', file.name, response);
              if (response.success) {
                resolve(response.data);
              } else {
                reject(new Error('Upload failed: ' + JSON.stringify(response)));
              }
            },
            onError: (error: any) => {
              console.error('Upload error for:', file.name, error);
              reject(error);
            }
          });
        });

        results.push(result);
        console.log(`Successfully uploaded ${file.name}, URL:`, result);
      }

      console.log('All files uploaded successfully:', results);
      return results;
    } catch (error) {
      console.error('Error in uploadFiles:', error);
      throw error;
    }
  };

  async function onSubmit(values: FormValues) {
    await form.trigger();
    console.log('Final Submitted Data:', values);
    console.log('Form State Errors:', form.formState.errors);

    console.log('values', values);
    console.log('aaaa', values.images.length, values.newImages?.length);
    if (values.images.length === 0 && values.newImages?.length === undefined) {
      toast.error('Please add atleast one Story Image');
      return;
    }
    let updatedImages = [...displayImages]; // Start with the current display images

    if (values.newImages?.length > 0) {
      // If new images are uploaded, upload them first
      const uploadedImages = await uploadFiles(values.newImages, uploadImage);
      updatedImages = [...updatedImages, ...uploadedImages]; // Append newly uploaded images
    }

    // Set the updated images to the state
    setDisplayImages(updatedImages);
    console.log('updatedImages', updatedImages);

    try {
      const finalData = {
        uniqueId: values.uniqueId,
        cityRef: values.cityRef,
        images: updatedImages,
        fullAddress: values.fullAddress,
        languageDetails: await Promise.all(
          values.languageDetails.map(async (lang, index) => {
            const initialLang = initialData?.languageDetails?.[index];
            return {
              languageRef: lang.languageRef,
              name: lang.name,
              description: lang.description,
              fullDescription: lang.fullDescription,
              audioSegment:
                lang.audioSegment?.length > 0
                  ? (await uploadFiles(lang.audioSegment, uploadAudio))[0]
                  : initialLang?.audioSegment || '',
              videoSegment:
                lang.videoSegment?.length > 0
                  ? (await uploadFiles(lang.videoSegment, uploadVideo))[0]
                  : initialLang?.videoSegment || ''
            };
          })
        ),
        otherDetails: values.otherDetails,
        storySource: {
          source: values.storySource.source,
          photos: values.storySource.photos
        },
        businessInfo: {
          logo:
            typeof values.businessInfo.logo === 'string'
              ? values.businessInfo.logo
              : values.businessInfo.logo?.length > 0
                ? (await uploadFiles(values.businessInfo.logo, uploadImage))[0]
                : initialData?.businessInfo?.logo || '',
          website: values.businessInfo.website,
          couponsDiscounts: values.businessInfo.couponsDiscounts,
          ticketSales: values.businessInfo.ticketSales,
          operatingHours: values.businessInfo.operatingHours
        },
        isNewStory: values.isNew,
        hideFromApp: values.hideFromApp || false,
        timeForNew: values.isNew ? values.timeForNew?.toISOString() : undefined,
        categoryRefs: [values.categoryRefs]
      };

      console.log('Submitting data:', JSON.stringify(finalData, null, 2));

      // return;
      if (initialData?._id) {
        await updateStory(finalData);
      } else {
        await addStory(finalData);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error(
        error instanceof Error ? error.message : 'Error submitting form'
      );
    }
  }

  const addLanguageDetail = () => {
    const currentDetails = form.getValues('languageDetails');

    form.setValue('languageDetails', [
      ...currentDetails,
      {
        languageRef: '',
        name: '',
        description: '',
        fullDescription: '',
        audioSegment: undefined,
        videoSegment: undefined
      }
    ]);
  };

  const handleEditorChange = (index: number, data: string) => {
    form.setValue(`languageDetails.${index}.fullDescription`, data, {
      shouldValidate: true,
      shouldDirty: true
    });
  };

  const isPending =
    isAddPending ||
    isUpdatePending ||
    isImageUploading ||
    isAudioUploading ||
    isVideoUploading;

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'isNew' && !value.isNew) {
        form.setValue('timeForNew', undefined);
      } else if (name === 'isNew' && value.isNew && !value.timeForNew) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        form.setValue('timeForNew', tomorrow);
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{pageTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="mb-6 text-xl font-semibold">
                  Basic Information
                </h2>
                <div className="mb-6 space-y-6">
                  <FormField
                    control={form.control}
                    name="uniqueId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unique ID</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter unique ID" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="cityRef"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <Select
                            onValueChange={(e) => {
                              field.onChange(e);
                              setDefaultCoordinate(
                                citiesData?.data?.data?.filter(
                                  (each) => each._id === e
                                )[0].location.coordinates
                              );
                            }}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a city" />
                            </SelectTrigger>
                            <FormControl>
                              <SelectContent>
                                {citiesData?.data?.data?.map((city) => (
                                  <SelectItem key={city._id} value={city._id}>
                                    {city.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </FormControl>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="categoryRefs"
                      render={({ field }) => (
                        <FormItem className="col-span-2 md:col-span-1">
                          <FormLabel>Categories</FormLabel>

                          <Select
                            onValueChange={(e) => {
                              field.onChange(e);
                            }}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <FormControl>
                              <SelectContent>
                                {categoriesData?.data?.data
                                  ?.filter(
                                    (category) => category.categoryType === 2
                                  )
                                  ?.map((category) => (
                                  <SelectItem key={category._id} value={category._id}>
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </FormControl>
                          </Select>

                          {/* <FormControl>
                            <MultiSelect
                              value={field.value}
                              onValueChange={field.onChange}
                              options={
                                categoriesData?.data?.data
                                  ?.filter(
                                    (category) => category.categoryType === 2
                                  )
                                  ?.map((category) => ({
                                    label: category.name,
                                    value: category._id
                                  })) || []
                              }
                              placeholder="Select categories"
                              defaultValue={initialData?.categoryRefs?.map(
                                (cat) => cat._id
                              )}
                            />
                          </FormControl> */}
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="hideFromApp"
                      render={({ field }) => (
                        <FormItem className="col-span-2 flex items-center justify-between rounded-lg border p-3 md:col-span-1">
                          <div className="space-y-0.5">
                            <FormLabel>Hide Story</FormLabel>
                            <div className="text-sm text-muted-foreground">
                              Hide the story from App
                            </div>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isNew"
                      render={({ field }) => (
                        <FormItem className="col-span-2 flex items-center justify-between rounded-lg border p-3 md:col-span-1">
                          <div className="space-y-0.5">
                            <FormLabel>New Story</FormLabel>
                            <div className="text-sm text-muted-foreground">
                              Mark this as a new story
                            </div>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {form.watch('isNew') && (
                      <FormField
                        control={form.control}
                        name="timeForNew"
                        render={({ field }) => (
                          <FormItem className="col-span-2 md:col-span-1">
                            <FormLabel>New Until</FormLabel>
                            <FormControl>
                              <DateTimePicker
                                value={field.value}
                                onChange={field.onChange}
                                fromDate={new Date()}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    <FormField
                      control={form.control}
                      name="images"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Story Images</FormLabel>

                          {displayImages.length > 0 ? (
                            <>
                              <div className="mb-4 flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                  {displayImages.length} image
                                  {displayImages.length > 1 ? 's' : ''} selected
                                </span>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setDisplayImages([]); // Clear displayed images
                                    form.setValue('images', []); // Clear form field for images
                                  }}
                                >
                                  Remove All Images
                                </Button>
                              </div>
                              <div className="mb-6 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
                                {displayImages.map((url, index) => (
                                  <div
                                    key={index}
                                    className="group relative aspect-square overflow-hidden rounded-lg border"
                                  >
                                    <Image
                                      src={url}
                                      alt={`Image ${index + 1}`}
                                      fill
                                      className="object-cover transition-transform hover:scale-105"
                                    />
                                    <Button
                                      type="button"
                                      variant="destructive"
                                      size="sm"
                                      className="absolute right-2 top-2"
                                      onClick={() => {
                                        const newImages = [...displayImages];
                                        newImages.splice(index, 1); // Remove image from preview
                                        setDisplayImages(newImages);

                                        const updatedFormValue = form
                                          .getValues('images')
                                          .filter((_, i) => i !== index); // Remove from form state
                                        form.setValue(
                                          'images',
                                          updatedFormValue
                                        );
                                      }}
                                    >
                                      Remove
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </>
                          ) : (
                            <span></span>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="newImages"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Upload New Images</FormLabel>
                          <FileUploader
                            onValueChange={(files) => {
                              field.onChange(files);
                            }}
                            value={
                              Array.isArray(field.value) ? field.value : []
                            }
                            maxFiles={5}
                            maxSize={MAX_FILE_SIZE}
                            accept={{ 'image/*': ['.jpg', '.jpeg', '.png'] }}
                            multiple={true}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="fullAddress"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Location</FormLabel>
                          <div className="space-y-2">
                            <Dialog
                              open={isLocationDialogOpen}
                              onOpenChange={(open) => {
                                const cityRef = form.watch('cityRef');
                                if (open && !cityRef) {
                                  toast.error('Please select a city first.');
                                  return;
                                }
                                setIsLocationDialogOpen(open);
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button
                                  type="button"
                                  variant={
                                    field.value.address ? 'default' : 'outline'
                                  }
                                  className="w-80 justify-start gap-2"
                                >
                                  {field.value.address ? (
                                    <>
                                      <Check className="h-4 w-4 text-green-500" />
                                      <span className="truncate">
                                        {field.value.address}
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <MapPin className="h-4 w-4" />
                                      <span>Select Location on Map</span>
                                    </>
                                  )}
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-5xl">
                                <DialogHeader>
                                  <DialogTitle>Select Location</DialogTitle>
                                </DialogHeader>
                                <div className="w-full">
                                  <MapWithSearch
                                    defaultAddress={field.value.address}
                                    defaultCoordinates={
                                      field.value.location.coordinates.length ? field.value.location.coordinates : defaultCoordinates
                                    }
                                    onLocationSelect={(address, coordinates) => {
                                      field.onChange({
                                        address: address || '',
                                        location: {
                                          type: 'Point',
                                          coordinates: coordinates.length ? coordinates : [0, 0],
                                        },
                                      });
                                    }}
                                  />
                                  {/* <MapInputWrapper
                                    defaultAddress={field.value.address}
                                    defaultCoordinates={
                                      field.value.location.coordinates.length ? field.value.location.coordinates : defaultCoordinates
                                    }
                                    onLocationSelect={(address, coordinates) => {
                                      field.onChange({
                                        address: address || '',
                                        location: {
                                          type: 'Point',
                                          coordinates: coordinates.length ? coordinates : [0, 0],
                                        },
                                      });
                                    }}
                                  /> */}
                                </div>
                                <DialogFooter className="sm:justify-end">
                                  <DialogClose asChild>
                                    <Button type="button" variant="outline">
                                      Save
                                    </Button>
                                  </DialogClose>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            {/* {field.value.address && (
                              <div className="text-sm text-muted-foreground">
                                Coordinates:{' '}
                                {field.value.location.coordinates[0].toFixed(6)}
                                ,{' '}
                                {field.value.location.coordinates[1].toFixed(6)}
                              </div>
                            )} */}
                          </div>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Story Details</h2>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addLanguageDetail}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" /> Add Language
                  </Button>
                </div>
                <div className="space-y-8">
                  {isLoading ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="h-6 w-6" />
                    </div>
                  ) : (
                    form.watch('languageDetails').map((detail, index) => (
                      <div
                        key={index}
                        className="relative space-y-6 rounded-lg border p-6"
                      >
                        {index > 0 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-4 top-4"
                            onClick={() => {
                              const current = form.getValues('languageDetails');
                              form.setValue(
                                'languageDetails',
                                current.filter((_, i) => i !== index)
                              );
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                          <FormField
                            control={form.control}
                            name={`languageDetails.${index}.languageRef`}
                            render={({ field }) => (
                              <FormItem className="col-span-2 md:col-span-1">
                                <FormLabel>Language</FormLabel>
                                <Select
                                  value={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue
                                        placeholder="Select language"
                                        defaultValue={field.value}
                                      />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {languagesData?.data?.data?.map(
                                      (language) => (
                                        <SelectItem
                                          key={language._id}
                                          value={language._id}
                                        >
                                          {language.name}
                                        </SelectItem>
                                      )
                                    )}
                                  </SelectContent>
                                </Select>
                                {/* <div className="text-xs text-muted-foreground">
                              Current value: {field.value}
                            </div> */}
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`languageDetails.${index}.name`}
                            render={({ field }) => (
                              <FormItem className="col-span-2 md:col-span-1">
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`languageDetails.${index}.description`}
                            render={({ field }) => (
                              <FormItem className="col-span-2">
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Enter description"
                                    {...field}
                                    rows={4}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="prose w-full col-span-2">
                            <p className="mb-2 text-sm">Full Description</p>
                            <CKEditorComp
                              section={undefined}
                              value={form.getValues(
                                `languageDetails.${index}.fullDescription`
                              )}
                              onChange={(data) =>
                                handleEditorChange(index, data)
                              }
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name={`languageDetails.${index}.audioSegment`}
                            render={({ field }) => (
                              <FormItem className="col-span-2">
                                <FormLabel>Audio Segment</FormLabel>
                                {initialData?.languageDetails[index]
                                  ?.audioSegment ? (
                                  <div className="flex items-center gap-2 rounded-md border p-2">
                                    <AudioLinesIcon className="h-4 w-4" />
                                    <span className="text-sm">
                                      {getFileNameFromUrl(
                                        initialData.languageDetails[index]
                                          .audioSegment
                                      )}
                                    </span>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      className="ml-auto h-6 w-6"
                                      onClick={() => {
                                        field.onChange(undefined);
                                        if (
                                          initialData &&
                                          initialData.languageDetails[index]
                                        ) {
                                          initialData.languageDetails[
                                            index
                                          ].audioSegment = '';
                                        }
                                        form.trigger(
                                          `languageDetails.${index}.audioSegment`
                                        );
                                      }}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ) : (
                                  <FormControl>
                                    <FileUploader
                                      onValueChange={(files) =>
                                        field.onChange(files)
                                      }
                                      value={
                                        Array.isArray(field.value)
                                          ? field.value
                                          : []
                                      }
                                      maxFiles={1}
                                      maxSize={MAX_FILE_SIZE}
                                      accept={{ 'audio/*': ['.mp3', '.wav'] }}
                                    />
                                  </FormControl>
                                )}
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* <FormField
                            control={form.control}
                            name={`languageDetails.${index}.videoSegment`}
                            render={({ field }) => (
                              <FormItem className="col-span-2">
                                <FormLabel>Video Segment</FormLabel>
                                {initialData?.languageDetails[index]
                                  ?.videoSegment ? (
                                  <div className="flex items-center gap-2 rounded-md border p-2">
                                    <VideoIcon className="h-4 w-4" />
                                    <span className="text-sm">
                                      {getFileNameFromUrl(
                                        initialData.languageDetails[index]
                                          .videoSegment
                                      )}
                                    </span>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      className="ml-auto h-6 w-6"
                                      onClick={() => {
                                        field.onChange(undefined);
                                        if (
                                          initialData &&
                                          initialData.languageDetails[index]
                                        ) {
                                          initialData.languageDetails[
                                            index
                                          ].videoSegment = '';
                                        }
                                        form.trigger(
                                          `languageDetails.${index}.videoSegment`
                                        );
                                      }}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ) : (
                                  <FormControl>
                                    <FileUploader
                                      onValueChange={(files) =>
                                        field.onChange(files)
                                      }
                                      value={
                                        Array.isArray(field.value)
                                          ? field.value
                                          : []
                                      }
                                      maxFiles={1}
                                      maxSize={MAX_FILE_SIZE}
                                      accept={{ 'video/*': ['.mp4', '.webm'] }}
                                    />
                                  </FormControl>
                                )}
                                <FormMessage />
                              </FormItem>
                            )}
                          /> */}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>

              {/* <Card className="p-6">
                <h2 className="mb-6 text-xl font-semibold">
                  Visiting Information
                </h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="otherDetails.openingHours"
                      render={({ field }) => (
                        <FormItem className="col-span-2 md:col-span-1">
                          <FormLabel>Opening Hours</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Mon-Fri: 9 AM - 5 PM"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="otherDetails.ticketPrice"
                      render={({ field }) => (
                        <FormItem className="col-span-2 md:col-span-1">
                          <FormLabel>Ticket Price</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., $10 - $25" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="otherDetails.additionalInfo"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Additional Information</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter any additional visitor information"
                              {...field}
                              rows={4}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </Card> */}

              <Card className="p-6">
                <h2 className="mb-6 text-xl font-semibold">Story Source</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="storySource.source"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Source</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter the source of the story"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="storySource.photos"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Source Photos</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Source Photos"
                              {...field}
                              rows={4}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="mb-6 text-xl font-semibold">
                  Business Information
                </h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="businessInfo.logo"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Business Logo</FormLabel>
                          {displayBusinessLogo ? (
                            <>
                              <div className="mb-4 flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                  Logo selected
                                </span>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setDisplayBusinessLogo('');
                                    field.onChange([]);
                                    form.setValue('businessInfo.logo', []);
                                  }}
                                >
                                  Remove Logo
                                </Button>
                              </div>
                              <div className="relative aspect-square w-48 overflow-hidden rounded-lg border">
                                <Image
                                  src={displayBusinessLogo}
                                  alt="Business logo"
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            </>
                          ) : (
                            <FormControl>
                              <FileUploader
                                onValueChange={(files) => {
                                  field.onChange(files);
                                  setDisplayBusinessLogo('');
                                }}
                                value={
                                  Array.isArray(field.value) ? field.value : []
                                }
                                maxFiles={1}
                                maxSize={MAX_FILE_SIZE}
                                accept={{
                                  'image/*': ['.jpg', '.jpeg', '.png']
                                }}
                              />
                            </FormControl>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="businessInfo.website"
                      render={({ field }) => (
                        <FormItem className="col-span-2 md:col-span-1">
                          <FormLabel>Website</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter business website"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="businessInfo.operatingHours"
                      render={({ field }) => (
                        <FormItem className="col-span-2 md:col-span-1">
                          <FormLabel>Operating Hours</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Mon-Sun: 10 AM - 10 PM"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="businessInfo.couponsDiscounts"
                      render={({ field }) => (
                        <FormItem className="col-span-2 md:col-span-1">
                          <FormLabel>Coupons/Discounts</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter available coupons or discounts"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="businessInfo.ticketSales"
                      render={({ field }) => (
                        <FormItem className="col-span-2 md:col-span-1">
                          <FormLabel>Ticket Sales</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter ticket sales information"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </Card>
            </div>

            <Button type="submit" disabled={isPending}>
              {isPending && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              {initialData ? 'Update Story' : 'Create Story'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

'use client';

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
import MapWithDirections from './route-map-navigation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { FileUploader } from '@/components/file-uploader';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import * as z from 'zod';
import { Route } from './route-tables/columns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { StorySelector } from './story-selector';
import { StoryPoints } from './story-points';
import { RouteMap } from './route-map';
import { useEffect, useState, useMemo } from 'react';
import { MultiSelect } from '@/components/ui/multi-select';
import Image from 'next/image';
import { X, Video, Plus, Search, Loader2, Trash2, Check, MapPin } from 'lucide-react';
import { useAddRoute, useUpdateRoute } from '@/hooks/content/use-route';
import { useImageUpload, useVideoUpload } from '@/hooks/common/use-upload';
import { toast } from 'sonner';
import { useAllCities } from '@/hooks/content/use-city';
import { useCategories } from '@/hooks/settings/use-category';
import { MapInput } from '../../story/_components/map-input';
import { MapInputWrapper } from '../../story/_components/map-input-wrapper';

import { useLanguages } from '@/hooks/settings/use-language';
import { Icons } from '@/components/icons';
import React from 'react';
import { useStories } from '@/hooks/content/use-story';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MapWithSearch } from '../../story/_components/mapbox-map-input';

interface StoryRef {
  _id: string;
  name: string;
  fullAddress: {
    location: {
      coordinates: [number, number];
    };
  };
}

interface Story {
  _id: string;
  uniqueId: string;
  languageDetails?: Array<{
    name: string;
  }>;
  fullAddress?: {
    address: string;
    location?: {
      coordinates: [number, number];
    };
  };
  cityRef: {
    _id: string;
  };
}

const MAX_FILE_SIZE = 50000000;
const ACCEPTED_IMAGE_TYPES = ['.jpg', '.jpeg', '.png', '.webp'];

const formSchema = z.object({
  uniqueId: z.string().min(2, 'Unique ID must be at least 2 characters'),
  cityRef: z.string().min(1, 'City is required'),
  images: z.array(z.string().url('Invalid image URL')),
  newImages: z.array(
    z
      .custom<File>((value) => value instanceof File, 'Please upload a valid image file')
      .refine((file) => file.size <= MAX_FILE_SIZE, {
        message: 'File size must be less than 5MB'
      })
      .refine((file) =>
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
    address: z.string(),
    location: z.object({
      type: z.literal('Point'),
      coordinates: z.tuple([z.number(), z.number()])
    })
  }).optional(),
  languageDetails: z.array(
    z.object({
      languageRef: z.string().min(1, 'Language is required'),
      name: z.string().min(1, 'Name is required'),
      introductoryText: z.string().min(1, 'Description is required')
    })
  ),
  storyRefs: z.array(
    z.union([
      z.string(),
      z.object({ _id: z.string() })
    ])
  ).min(1, "Please select at least one story for this route"),
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
  storyPoints: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      coordinates: z.tuple([z.number(), z.number()])
    })
  ),
  isRecommended: z.boolean(),
  hideFromApp: z.boolean(),
  categoryRefs: z.string()
});

type FormValues = z.infer<typeof formSchema>;

export default function RouteForm({
  initialData,
  pageTitle
}: {
  initialData: Route | null;
  pageTitle: string;
}) {
  const [defaultCoordinates, setDefaultCoordinate] = useState([]);

  const [selectedPoint, setSelectedPoint] = useState<StoryPoint | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([0, 0]);
  const [displayImages, setDisplayImages] = React.useState<string[]>(
    initialData?.images || []
  );
  const [displayBusinessLogo, setDisplayBusinessLogo] = React.useState<string>(
    initialData?.businessInfo?.logo || ''
  );
  const [filteredStories, setFilteredStories] = useState<StoryRef[] | null>(
    null
  );
  const [isStoriesLoading, setIsStoriesLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);

  console.log('initialData', initialData);

  const { data: citiesData } = useAllCities();
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

  const { mutate: addRoute, isPending: isAddPending } = useAddRoute();
  const { mutate: updateRoute, isPending: isUpdatePending } = useUpdateRoute(
    initialData?._id ?? ''
  );
  const { mutateAsync: uploadImage, isPending: isUploading } = useImageUpload();
  const { mutateAsync: uploadVideo } = useVideoUpload();

  const isPending = isAddPending || isUpdatePending || isUploading;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      uniqueId: initialData?.uniqueId || '',
      cityRef: initialData?.cityRef._id || undefined,
      images: initialData?.images || [],
      fullAddress: initialData?.fullAddress || {
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
          introductoryText: detail.introductoryText || '',
        }))
        : [{
          languageRef: undefined,
          name: '',
          introductoryText: '',
        }],
      storyRefs: initialData?.storyRefs
        ? initialData.storyRefs.map(ref => typeof ref === 'string' ? ref : ref._id)
        : [],
      businessInfo: {
        logo: initialData?.businessInfo?.logo || '',
        website: initialData?.businessInfo?.website || '',
        couponsDiscounts: initialData?.businessInfo?.couponsDiscounts || '',
        ticketSales: initialData?.businessInfo?.ticketSales || '',
        operatingHours: initialData?.businessInfo?.operatingHours || ''
      },
      storyPoints: [],

      isRecommended: initialData?.isRecommended || false,
      hideFromApp: initialData?.hideFromApp || false,

      categoryRefs: initialData?.categoryRefs && initialData?.categoryRefs.length ? initialData?.categoryRefs[0]._id : undefined
    }
  });

  const cityRef = form.watch('cityRef')

  const { data: storiesData } = useStories({
    skip: 0,
    limit: 0,
    filters: { cityRef: cityRef || undefined },
    sortConfig: {}
  });

  // Get initial story points
  const initialStoryPoints = useMemo(() => {
    console.log('Computing initial story points:', {
      storyRefs: initialData?.storyRefs,
      storiesData: storiesData?.data?.data
    });

    // Check if we have both the required data
    if (
      !Array.isArray(initialData?.storyRefs) ||
      !Array.isArray(storiesData?.data?.data)
    ) {
      console.log('Missing required data, returning empty array');
      return [];
    }

    // Map story refs to points
    const points = initialData.storyRefs
      .map((storyRef) => {
        const storyId = typeof storyRef === "string" ? storyRef : storyRef._id;
        const story = storiesData.data.data.find((s) => s._id === storyId);

        if (!story || !story.fullAddress?.location?.coordinates) {
          console.log(`No valid story found for ID: ${storyId}`);
          return null;
        }

        return {
          id: storyId,
          name: story.uniqueId || story.fullAddress?.address || 'Unnamed Location',
          coordinates: story.fullAddress.location.coordinates
        };
      })
      .filter((point) => point !== null);

    console.log('Computed story points:', points);
    return points;
  }, [initialData?.storyRefs, storiesData?.data?.data]);

  useEffect(() => {
    if (initialStoryPoints?.length > 0) {
      console.log('Setting initial story points:', initialStoryPoints);
      form.setValue('storyPoints', initialStoryPoints);

      // Also set the initial map center to the first story point
      if (initialStoryPoints[0]?.coordinates) {
        setMapCenter(initialStoryPoints[0].coordinates);
      }
    }
  }, [initialStoryPoints, form]);

  const storyPoints = form.watch('storyPoints');
  const addressWatch = form.watch('fullAddress');

  useEffect(() => {
    console.log("addressWatch", addressWatch)
  }, [addressWatch]);

  useEffect(() => {
    if (Array.isArray(storyPoints) && storyPoints?.length > 0) {
      // Center map on first point
      setMapCenter(storyPoints[0].coordinates);
    }
  }, [storyPoints]);

  const uploadFiles = async (files: File[], uploadFn: typeof uploadImage) => {
    console.log('Starting file upload for:', files?.length, 'files');
    if (!Array.isArray(files) || files.length === 0) return [];

    const results: string[] = [];

    try {
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

  // Update the onSubmit function's image handling
  async function onSubmit(values: FormValues) {
    try {
      console.log('Form values on submit:', values);
      console.log("values", values)
      console.log("aaaa", values.images.length, values.newImages?.length)
      if (values.images.length === 0 && values.newImages?.length === undefined) {
        toast.error("Please add atleast one Story Image")
        return
      }
      let updatedImages = [...displayImages]; // Start with the current display images

      if (values.newImages?.length > 0) {
        // If new images are uploaded, upload them first
        const uploadedImages = await uploadFiles(values.newImages, uploadImage);
        updatedImages = [...updatedImages, ...uploadedImages]; // Append newly uploaded images
      }

      // Set the updated images to the state
      setDisplayImages(updatedImages);
      console.log("updatedImages", updatedImages)


      const finalData = {
        uniqueId: values.uniqueId,
        cityRef: values.cityRef,
        images: updatedImages,
        fullAddress: values.fullAddress,
        languageDetails: await Promise.all(
          values.languageDetails.map(async (lang, index) => {
            return {
              languageRef: lang.languageRef,
              name: lang.name,
              introductoryText: lang.introductoryText
            };
          })
        ),
        storyPoints: values.storyPoints,
        storyRefs: values.storyRefs.map(ref =>
          typeof ref === 'string' ? ref : ref._id
        ),
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
        categoryRefs: [values.categoryRefs],
        isRecommended: values.isRecommended,
        hideFromApp: values.hideFromApp,

      };
      console.log('Final data before submission:', finalData);

      if (initialData?._id) {
        await updateRoute(finalData);
      } else {
        await addRoute(finalData);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error(
        error instanceof Error ? error.message : 'Error submitting form'
      );
    }
  }

  // Update the useEffect for form reset to include storyPoints
  useEffect(() => {
    console.log('initialData in useEffect:', initialData);
    if (initialData) {

      setDisplayImages(initialData.images || []);
      setDisplayBusinessLogo(initialData.businessInfo?.logo || '');

      form.reset({
        cityRef: initialData.cityRef?._id || "",
        images: initialData?.images || [], // Reset images field but keep displayImages state
        languageDetails: initialData.languageDetails.map((detail) => ({
          languageRef: detail.languageRef?._id || detail.languageRef || '',
          name: detail.name || '',
          introductoryText: detail.introductoryText || '',

        })),

        storyRefs: Array.isArray(initialData.storyRefs)
          ? initialData.storyRefs
          : [],
        storyPoints: initialStoryPoints || [], // Add this line
        businessInfo: {
          logo: initialData.businessInfo?.logo || '',
          website: initialData.businessInfo.website,
          couponsDiscounts: initialData.businessInfo.couponsDiscounts,
          ticketSales: initialData.businessInfo.ticketSales,
          operatingHours: initialData.businessInfo.operatingHours
        },
        categoryRefs: initialData.categoryRefs && initialData?.categoryRefs.length ? initialData?.categoryRefs[0]._id : "",
        isRecommended: initialData.isRecommended,
        hideFromApp: initialData.hideFromApp,
      });
    }
  }, [initialData, form]);

  useEffect(() => {
    // Set initial loading state
    setIsStoriesLoading(true);

    // Add 1 second delay
    const timer = setTimeout(() => {
      setIsStoriesLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const formValues = form.watch()

  const addLanguageDetail = () => {
    const currentDetails = form.getValues('languageDetails');

    form.setValue('languageDetails', [
      ...currentDetails,
      {
        languageRef: '',
        name: '',
        introductoryText: ''

      }
    ]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{pageTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-6">
              {/* Basic Information Card */}
              <Card className="p-6">
                <h2 className="mb-6 text-xl font-semibold">
                  Basic Information
                </h2>
                <div className="mb-6 space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
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

                    <FormField
                      control={form.control}
                      name="cityRef"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <Select
                            onValueChange={e => {
                              field.onChange(e);
                              setDefaultCoordinate(citiesData?.data?.data?.filter(each => each._id === e)[0].location.coordinates);
                            }}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a city" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {citiesData?.data?.data?.map((city) => (
                                <SelectItem key={city._id} value={city._id}>
                                  {city.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="categoryRefs"
                      render={({ field }) => (
                        <FormItem>
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
                                    (category) => category.categoryType === 3
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
                                categoriesData?.data?.data?.filter((category) => category.categoryType === 3)?.map((category) => ({
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
                      name="isRecommended"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel>Recommended</FormLabel>
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
                      name="hideFromApp"
                      render={({ field }) => (
                        <FormItem className="col-span-2 flex items-center justify-between rounded-lg border p-3 md:col-span-1">
                          <div className="space-y-0.5">
                            <FormLabel>Hide Route</FormLabel>
                            <div className="text-sm text-muted-foreground">
                              Hide the route from App
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
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {/* <FormField
                      control={form.control}
                      name="isNewRoute"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel>New Route</FormLabel>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    /> */}
                  </div>

                  <FormField
                    control={form.control}
                    name="images"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Route Images</FormLabel>

                        {displayImages.length > 0 ? (
                          <>
                            <div className="mb-4 flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">
                                {displayImages.length} image{displayImages.length > 1 ? 's' : ''} selected
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
                                    className="absolute top-2 right-2"
                                    onClick={() => {
                                      const newImages = [...displayImages];
                                      newImages.splice(index, 1); // Remove image from preview
                                      setDisplayImages(newImages);

                                      const updatedFormValue = form.getValues('images').filter((_, i) => i !== index); // Remove from form state
                                      form.setValue('images', updatedFormValue);
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
                      </FormItem>)}
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
                          value={Array.isArray(field.value) ? field.value : []}
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
                                  onLocationSelect={(
                                    address,
                                    coordinates
                                  ) => {
                                    field.onChange({
                                      address,
                                      location: {
                                        type: 'Point',
                                        coordinates: coordinates.length ? coordinates : [0, 0]
                                      }
                                    });
                                  }}
                                /> */}
                              </div><DialogFooter className="sm:justify-end">
                                <DialogClose asChild>
                                  <Button type="button" variant="outline">
                                    Save
                                  </Button>
                                </DialogClose>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          {field.value.address && (
                            <div className="text-sm text-muted-foreground">
                              Coordinates:{' '}
                              {field.value.location.coordinates[0].toFixed(6)}
                              ,{' '}
                              {field.value.location.coordinates[1].toFixed(6)}
                            </div>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </Card>

              <Card className="p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Route Name</h2>
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
                            name={`languageDetails.${index}.introductoryText`}
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

                          {/* <div className="prose w-full col-span-2">
                            <p className="mb-2 text-sm">Full Description</p>
                            <CKEditorComp
                              section={undefined}
                              value={form.getValues(
                                `languageDetails.${index}.introductoryText`
                              )}
                              onChange={(data) =>
                                handleEditorChange(index, data)
                              }
                            />
                          </div> */}


                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>

              {/* Stories and Route Map Card */}
              <Card className="p-6">
                <h2 className="mb-6 text-xl font-semibold">Route Details</h2>
                <div className="space-y-6">
                  {/* Replace the existing StorySelector with this new section */}
                  <FormField
                    control={form.control}
                    name="storyRefs"
                    render={({ field }) => (
                      <FormItem>
                        <div className="mb-4 flex items-center justify-between">
                          <FormLabel>Stories</FormLabel>
                          <Dialog
                            open={isDialogOpen}
                            onOpenChange={(open) => {
                              const cityRef = form.watch('cityRef');
                              if (open && !cityRef) {
                                toast.error('Please select a city first.');
                                return;
                              }
                              setIsDialogOpen(open);
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Stories
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Select Stories</DialogTitle>
                              </DialogHeader>

                              {/* Add search input */}
                              <div className="relative mb-4">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                  placeholder="Search stories..."
                                  className="pl-9"
                                  onChange={(e) => {
                                    const searchTerm =
                                      e.target.value.toLowerCase();
                                    if (!searchTerm) {
                                      setFilteredStories(null); // Reset to null when search is empty
                                      return;
                                    }
                                    const filteredStories =
                                      storiesData?.data?.data?.filter(
                                        (story) =>
                                        (story.uniqueId
                                          ?.toLowerCase()
                                          .includes(searchTerm) ||
                                          story.fullAddress?.address
                                            ?.toLowerCase()
                                            .includes(searchTerm))
                                      );
                                    setFilteredStories(filteredStories || []);
                                  }}
                                />
                              </div>

                              <ScrollArea className="h-[500px] pr-4">
                                <div className="space-y-4">
                                  {(filteredStories === null
                                    ? storiesData?.data?.data
                                    : filteredStories
                                  )

                                    ?.map((story) => (
                                      <div
                                        key={story._id}
                                        className="flex cursor-pointer items-center space-x-4 rounded-lg border p-4 hover:bg-accent"
                                        onClick={() => {
                                          const currentRefs = field.value || [];
                                          // Normalize existing references to strings
                                          const normalizedRefs = currentRefs.map(ref =>
                                            typeof ref === 'string' ? ref : ref._id
                                          );

                                        
                                          const newRefs = normalizedRefs.includes(story._id)
                                            ? normalizedRefs.filter(ref => ref !== story._id)
                                            : [...normalizedRefs, story._id]; // preserves order

                                          field.onChange(newRefs);

                                          // Update story points preserving the order of newRefs
                                          const newStoryPoints = newRefs.map(refId => {
                                            const storyData = storiesData.data.data.find(s => s._id === refId);
                                            return {
                                              id: refId,
                                              name: storyData?.uniqueId || 'Unnamed Story',
                                              coordinates: storyData?.fullAddress?.location?.coordinates || [0, 0]
                                            };
                                          }).filter(point => point);

                                          form.setValue('storyPoints', newStoryPoints, {
                                            shouldDirty: true
                                          });
                                        }}
                                      >
                                        <div className="flex-1">
                                          <h4 className="font-medium">
                                            {story.uniqueId || 'Unnamed Story'}
                                          </h4>
                                          <p className="text-sm text-muted-foreground">
                                            {story.fullAddress?.address}
                                          </p>
                                        </div>
                                        <div className="flex items-center">
                                          {field.value?.includes(story._id) && (
                                            <Icons.check className="h-4 w-4 text-primary" />
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              </ScrollArea>
                              <DialogFooter className="sm:justify-end">
                                <DialogClose asChild>
                                  <Button type="button" variant="outline">
                                    Save
                                  </Button>
                                </DialogClose>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>

                        {/* Show loading state */}
                        {isStoriesLoading ? (
                          <div className="flex items-center justify-center p-8">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                          </div>
                        ) : (
                          <>
                            {/* Show selected stories for reordering */}
                            <FormField
                              control={form.control}
                              name="storyPoints"
                              render={({ field: storyPointsField }) => (
                                <FormItem>
                                  <FormControl>
                                    <StoryPoints
                                      value={storyPointsField.value}
                                      onChange={(newPoints) => {
                                        storyPointsField.onChange(newPoints);
                                        // Update storyRefs to match new order
                                        field.onChange(
                                          newPoints.map((point) => point.id)
                                        );
                                        setIsUpdated(true); // Set updated state to true
                                      }}
                                      onPointSelect={setSelectedPoint}
                                      onRemove={(pointId) => {
                                        const newPoints =
                                          storyPointsField.value.filter(
                                            (p) => p.id !== pointId
                                          );
                                        storyPointsField.onChange(newPoints);
                                        // Also update storyRefs
                                        field.onChange(
                                          newPoints.map((p) => p.id)
                                        );
                                        setIsUpdated(true); // Set updated state to true
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Keep the existing map section */}
                  {storyPoints.length > 1 ?
                    <div className="h-[600px]">

                      {/* <MapWithDirections storyPoints={storyPoints} /> */}
                      <RouteMap
                        markers={
                          Array.isArray(form.watch('storyPoints'))
                            ? form.watch('storyPoints').map((point, index) => ({
                              id: point.id,
                              coordinates: point.coordinates,
                              label: `${index + 1}. ${point.name}`,
                              index
                            }))
                            : []
                        }
                        isUpdated={isUpdated}
                        setIsUpdated={setIsUpdated}
                      />
                    </div>
                    : null}
                </div>
              </Card>

              {/* Other Details Card */}
              {/* <Card className="p-6">
                <h2 className="mb-6 text-xl font-semibold">
                  Visiting Information
                </h2>
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="otherDetails.openingHours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Opening Hours</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 10 AM - 5 PM" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="otherDetails.ticketPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ticket Price</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Rs 100" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="otherDetails.additionalInfo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Information</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Enter additional details"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </Card> */}

              {/* Business Information Card */}
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
              {initialData ? 'Update Route' : 'Create Route'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

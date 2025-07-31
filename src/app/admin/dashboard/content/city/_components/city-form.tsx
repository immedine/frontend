'use client';

import { Icons } from '@/components/icons';
import { FileUploader } from '@/components/file-uploader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useAddCity, useUpdateCity } from '@/hooks/content/use-city';
import { useImageUpload } from '@/hooks/common/use-upload';
import { useLanguages } from '@/hooks/settings/use-language';
import { toast } from 'sonner';
import { MultiSelect } from '@/components/ui/multi-select';
import Image from 'next/image';
import { Plus, X } from 'lucide-react';
import { useState, useEffect } from 'react';

import dynamic from 'next/dynamic';
import { MapWithSearch } from '../../story/_components/mapbox-map-input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { hi } from 'date-fns/locale';

const CKEditorComp = dynamic(() => import('@/components/ck-editor'), {
  ssr: false
});

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ['.jpg', '.jpeg', '.png', '.webp'];

const sections = ['general', 'history', 'transport', 'eat', 'sleep'];

const fileValidationSchema = z
  .custom<File>((value) => value instanceof File, 'Please upload a valid file')
  .refine((file) => file instanceof File && file.size <= MAX_FILE_SIZE, {
    message: 'File size must be less than 5MB'
  })
  .refine(
    (file) =>
      file instanceof File &&
      ACCEPTED_IMAGE_TYPES.some((type) =>
        file.name.toLowerCase().endsWith(type)
      ),
    { message: 'Only .jpg, .png, .jpeg and .webp files are accepted' }
  );

const languageDescriptionSchema = z.object({
  languageRef: z.string(),
  text: z.string().optional()
});

const informationSectionSchema = z.object({
  text: z.string().optional(),
  description: z.array(languageDescriptionSchema).optional().default([]),
  images: z.array(z.string().url('Invalid image URL')).optional().default([]),
  newImages: z.array(fileValidationSchema).optional().default([])
});

const formSchema = z.object({
  fullAddress: z.object({
    address: z.string(),
    city: z.string().min(1, 'City name is required'),
    location: z.object({
      type: z.literal('Point'),
      coordinates: z.tuple([z.number(), z.number()])
    })
  }),
  photo: z.union([z.string().url('Invalid photo URL'), fileValidationSchema]),
  otherInformation: z.object({
    general: informationSectionSchema,
    history: informationSectionSchema,
    transport: informationSectionSchema,
    eat: informationSectionSchema,
    sleep: informationSectionSchema
  }),
  hideFromApp: z.boolean()
});

type FormValues = z.infer<typeof formSchema>;

interface CityFormProps {
  cityId: string;
  pageTitle: string;
  initialData: any;
}

let newImagesObj = {
  general: [],
  history: [],
  transport: [],
  eat: [],
  sleep: []
};

export default function CityForm({
  initialData,
  cityId,
  pageTitle
}: CityFormProps) {
  const [displayImages, setDisplayImages] = useState({
    general: initialData?.otherInformation?.general?.images || [],
    history: initialData?.otherInformation?.history?.images || [],
    transport: initialData?.otherInformation?.transport?.images || [],
    eat: initialData?.otherInformation?.eat?.images || [],
    sleep: initialData?.otherInformation?.sleep?.images || []
  });

  const [activeTab, setActiveTab] = useState('general');
  const [selectedLanguageId, setSelectedLanguageId] = useState<string>('');
  const [englishLanguageId, setEnglishLanguageId] = useState<string>('');

  const { mutate: addCity, isPending: isAddPending } = useAddCity();
  const { mutate: updateCity, isPending: isUpdatePending } =
    useUpdateCity(cityId);

  const { mutateAsync: uploadImage, isPending: isUploading } = useImageUpload();

  const { data: languagesData } = useLanguages({
    skip: 0,
    limit: 0,
    filters: {},
    sortConfig: {}
  });

  // Process initialData to separate English description from other languages
  const processInitialData = (data) => {
    const processed = { ...data };

    if (!processed || !processed.otherInformation) return processed;

    for (const section of sections) {
      if (processed.otherInformation[section]) {
        const descriptions =
          processed.otherInformation[section].description || [];

        // Find English description and set it as the main text
        const englishDescIndex = descriptions.findIndex(
          (desc) => desc.languageRef === englishLanguageId
        );

        if (englishDescIndex !== -1) {
          // Set the English text as the main text
          const englishText = descriptions[englishDescIndex].text;
          processed.otherInformation[section].text = englishText;

          // Remove English from descriptions array
          processed.otherInformation[section].description = descriptions.filter(
            (_, index) => index !== englishDescIndex
          );
        }
      }
    }

    return processed;
  };

  // Initialize form with processed data
  const initializeForm = (data) => {
    const processedData = processInitialData(data);
    form.reset({
      photo: processedData?.photo || '',
      fullAddress: {
        address: processedData?.name || '',
        city: processedData?.city || '',
        location: processedData?.location || {
          type: 'Point',
          coordinates: [5.613491, 51.972466]
        }
      },
      hideFromApp: processedData?.hideFromApp || false,
      otherInformation: {
        general: {
          text: processedData?.otherInformation?.general?.text || '',
          description:
            processedData?.otherInformation?.general?.description || [],
          images: processedData?.otherInformation?.general?.images || [],
          newImages: newImagesObj.general.length ? newImagesObj.general : undefined
        },
        history: {
          text: processedData?.otherInformation?.history?.text || '',
          description:
            processedData?.otherInformation?.history?.description || [],
          images: processedData?.otherInformation?.history?.images || [],
          newImages: newImagesObj.history.length ? newImagesObj.history : undefined
        },
        transport: {
          text: processedData?.otherInformation?.transport?.text || '',
          description:
            processedData?.otherInformation?.transport?.description || [],
          images: processedData?.otherInformation?.transport?.images || [],
          newImages: newImagesObj.transport.length ? newImagesObj.transport : undefined
        },
        eat: {
          text: processedData?.otherInformation?.eat?.text || '',
          description: processedData?.otherInformation?.eat?.description || [],
          images: processedData?.otherInformation?.eat?.images || [],
          newImages: newImagesObj.eat.length ? newImagesObj.eat : undefined
        },
        sleep: {
          text: processedData?.otherInformation?.sleep?.text || '',
          description:
            processedData?.otherInformation?.sleep?.description || [],
          images: processedData?.otherInformation?.sleep?.images || [],
          newImages: newImagesObj.sleep.length ? newImagesObj.sleep : undefined
        }
      }
    });
  };

  useEffect(() => {
    return () => {
      newImagesObj = {
        general: [],
        history: [],
        transport: [],
        eat: [],
        sleep: []
      }
    }
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      photo: '',
      fullAddress: {
        address: '',
        city: '',
        location: {
          type: 'Point',
          coordinates: [5.613491, 51.972466]
        }
      },
      otherInformation: {
        general: {
          text: '',
          description: [],
          images: [],
          newImages: undefined
        },
        history: {
          text: '',
          description: [],
          images: [],
          newImages: undefined
        },
        transport: {
          text: '',
          description: [],
          images: [],
          newImages: undefined
        },
        eat: {
          text: '',
          description: [],
          images: [],
          newImages: undefined
        },
        sleep: {
          text: '',
          description: [],
          images: [],
          newImages: undefined
        }
      }
    }
  });

  const languageOptions =
    languagesData?.data?.data?.map((lang) => ({
      label: lang.name,
      value: lang._id
    })) || [];

  // Find English language ID for default selection
  useEffect(() => {
    const english =
      languageOptions.find((lang) => lang.label.toLowerCase() === 'english')
        ?.value || '';

    if (english) {
      setEnglishLanguageId(english);
    }
  }, [languageOptions]);

  // Initialize form data after English language ID is found
  useEffect(() => {
    if (englishLanguageId && initialData) {
      initializeForm(initialData);
    }
  }, [englishLanguageId, initialData]);

  // Get available languages (those not already used in descriptions for the current tab)
  const getAvailableLanguages = (section: string) => {
    const usedLanguageIds =
      form
        .getValues(`otherInformation.${section}.description`)
        ?.map((desc) => desc.languageRef) || [];

    // Add English to used languages if not already there
    if (englishLanguageId && !usedLanguageIds.includes(englishLanguageId)) {
      usedLanguageIds.push(englishLanguageId);
    }

    return languageOptions.filter(
      (lang) => !usedLanguageIds.includes(lang.value)
    );
  };

  const handleEditorChange = (section: string, data: string) => {
    form.setValue(`otherInformation.${section}.text`, data, {
      shouldValidate: true,
      shouldDirty: true
    });
  };

  const handleLanguageDescriptionChange = (
    section: string,
    languageId: string,
    data: string
  ) => {
    const descriptions =
      form.getValues(`otherInformation.${section}.description`) || [];
    const index = descriptions.findIndex(
      (desc) => desc.languageRef === languageId
    );

    if (index !== -1) {
      descriptions[index].text = data;
    } else {
      descriptions.push({
        languageRef: languageId,
        text: data
      });
    }

    form.setValue(`otherInformation.${section}.description`, descriptions, {
      shouldValidate: true,
      shouldDirty: true
    });
  };

  const addLanguageDescription = (section: string) => {
    if (!selectedLanguageId) {
      toast.error('Please select a language first');
      return;
    }

    // Don't allow adding English as a translation
    if (selectedLanguageId === englishLanguageId) {
      toast.error('English is already set as the default language');
      return;
    }

    const descriptions =
      form.getValues(`otherInformation.${section}.description`) || [];
    const existingDesc = descriptions.find(
      (desc) => desc.languageRef === selectedLanguageId
    );

    if (existingDesc) {
      toast.error('This language is already added');
      return;
    }

    descriptions.push({
      languageRef: selectedLanguageId,
      text: ''
    });

    form.setValue(`otherInformation.${section}.description`, descriptions, {
      shouldValidate: true,
      shouldDirty: true
    });

    // Reset selected language and show placeholder
    setSelectedLanguageId('');
  };

  const removeLanguageDescription = (section: string, languageId: string) => {
    const descriptions =
      form.getValues(`otherInformation.${section}.description`) || [];
    const filteredDescriptions = descriptions.filter(
      (desc) => desc.languageRef !== languageId
    );

    form.setValue(
      `otherInformation.${section}.description`,
      filteredDescriptions,
      {
        shouldValidate: true,
        shouldDirty: true
      }
    );
  };

  const getLanguageName = (languageId: string) => {
    return (
      languageOptions.find((lang) => lang.value === languageId)?.label ||
      languageId
    );
  };

  const uploadFiles = async (files: File[], uploadFn: typeof uploadImage) => {
    if (!Array.isArray(files) || files.length === 0) return [];

    const results: string[] = [];

    try {
      for (const file of files) {
        const result = await new Promise<string>((resolve, reject) => {
          uploadFn(file, {
            onSuccess: (response: { success: boolean; data: string }) => {
              if (response.success) {
                resolve(response.data);
              } else {
                reject(new Error('Upload failed: ' + JSON.stringify(response)));
              }
            },
            onError: (error: any) => {
              reject(error);
            }
          });
        });

        results.push(result);
      }

      return results;
    } catch (error) {
      console.error('Error in uploadFiles:', error);
      throw error;
    }
  };

  const isFileObject = (value: any) => {
    return typeof window !== 'undefined' && value instanceof File;
  };

  async function onSubmit(values: FormValues) {
    try {
      let photoUrl = values.photo;

      if (!values.fullAddress.address) {
        toast.error('Please select a city');
        return;
      }

      // Handle main photo upload
      if (values.photo instanceof File) {
        const uploadResponse = await uploadImage(values.photo);
        photoUrl = uploadResponse.data;
      }

      const updatedDisplayImages = { ...displayImages };

      // Upload images for each section
      for (const section of sections) {
        const sectionData = values.otherInformation[section];

        // Keep existing images
        updatedDisplayImages[section] = [...displayImages[section]];

        // Upload new images if any
        if (sectionData.newImages?.length > 0) {
          try {
            const uploadedImages = await uploadFiles(
              sectionData.newImages,
              uploadImage
            );

            // Add newly uploaded images to the section
            updatedDisplayImages[section] = [
              ...updatedDisplayImages[section],
              ...uploadedImages
            ];
          } catch (uploadError) {
            console.error(
              `Error uploading images for ${section}:`,
              uploadError
            );
            toast.error(`Failed to upload images for ${section}`);
            throw uploadError; // Prevent form submission if uploads fail
          }
        }
      }
      const cityData = {
        name: values.fullAddress.address,
        location: values.fullAddress.location,
        photo: photoUrl,
        city: values.fullAddress.city,
        hideFromApp: values.hideFromApp,
        otherInformation: Object.fromEntries(
          sections.map((section) => {
            const baseText = values.otherInformation[section].text;
            const baseDescriptions =
              values.otherInformation[section].description || [];

            // Always add English description using the main text field
            const allDescriptions = [
              // Add English as a description entry
              {
                languageRef: englishLanguageId,
                text: baseText
              },
              // Add all other language descriptions
              ...baseDescriptions
            ];

            return [
              section,
              {
                text: baseText, // Keep for backward compatibility
                description: allDescriptions,
                images: updatedDisplayImages[section]
              }
            ];
          })
        )
      };

      // Only update state and submit if all uploads are successful
      setDisplayImages(updatedDisplayImages);

      if (cityId === 'new') {
        addCity(cityData);
      } else {
        updateCity(cityData);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to process image upload'
      );
    }
  }

  const handleFileSelect = (files: File[], section: string) => {
    form.setValue(`otherInformation.${section}.newImages`, files);
    newImagesObj[section] = files;
  };

  const isPending = isAddPending || isUpdatePending || isUploading;

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{pageTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-6">
              <div className="flex  gap-12">
                <FormField
                  control={form.control}
                  name="fullAddress"
                  render={({ field }) => (
                    <>
                      <FormItem className="col-span-2">
                        <FormLabel>City</FormLabel>
                        <div className="space-y-2">
                          <Dialog>
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
                                    <span className="truncate">
                                      {field.value.address}
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <span>Select City</span>
                                  </>
                                )}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-6xl">
                              <DialogHeader>
                                <DialogTitle>Select City</DialogTitle>
                              </DialogHeader>
                              <div className="w-full">
                                <MapWithSearch
                                  defaultAddress={field.value.address}
                                  defaultCoordinates={
                                    field.value.location.coordinates.length
                                      ? field.value.location.coordinates
                                      : [0, 0]
                                  }
                                  onLocationSelect={(address, coordinates) => {
                                    field.onChange({
                                      address: address || '',
                                      location: {
                                        type: 'Point',
                                        coordinates: coordinates.length
                                          ? coordinates
                                          : [0, 0]
                                      },
                                      city: address?.length
                                        ? address.split(',')[0]
                                        : ''
                                    });
                                  }}
                                />
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
                          {field.value.address && (
                            <div className="text-sm text-muted-foreground">
                              Coordinates:{' '}
                              {field.value?.location?.coordinates[0]?.toFixed(
                                6
                              )}
                              ,{' '}
                              {field.value?.location?.coordinates[1]?.toFixed(
                                6
                              )}
                            </div>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>

                      <FormItem>
                        <FormLabel>City in app</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter city in app"
                            type="text"
                            value={field.value.city}
                            onChange={(e) => {
                              field.onChange({
                                ...field.value,
                                city: e.target.value
                              });
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hideFromApp"
                  render={({ field }) => (
                    <FormItem className="flex w-80 items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Hide City</FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Hide the city from App
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

              <FormField
                control={form.control}
                name="photo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Photo</FormLabel>
                    {field.value && typeof field.value === 'string' ? (
                      <>
                        <div className="relative aspect-square w-60 overflow-hidden rounded-lg border">
                          <Image
                            src={field.value}
                            alt="Photo"
                            fill
                            className="object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute right-2 top-2 h-6 w-6"
                            onClick={() => {
                              field.onChange('');
                              form.setValue('photo', '');
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <FormControl>
                          <FileUploader
                            onValueChange={(files) => {
                              field.onChange((files as File[])?.[0] || '');
                            }}
                            value={
                              isFileObject(field.value) ? [field.value] : []
                            }
                            maxFiles={1}
                            maxSize={5 * 1024 * 1024}
                            accept={{ 'image/*': ['.jpg', '.jpeg', '.png'] }}
                          />
                        </FormControl>
                      </>
                    )}

                    <FormMessage />
                  </FormItem>
                )}
              />

              <Card>
                <CardContent className="p-6">
                  <Tabs
                    defaultValue="general"
                    className="w-full"
                    onValueChange={(value) => setActiveTab(value)}
                  >
                    <TabsList className="grid w-full grid-cols-5">
                      {sections.map((section) => (
                        <TabsTrigger key={section} value={section}>
                          {section !== 'sleep' ? section.charAt(0).toUpperCase() + section.slice(1) : "Activities"}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {sections.map((section) => (
                      <TabsContent key={section} value={section}>
                        <div className="space-y-6">
                          <FormField
                            control={form.control}
                            name={`otherInformation.${section}.images`}
                            render={({ field }) => (
                              <FormItem className="col-span-2">
                                <FormLabel>Current Images</FormLabel>
                                {displayImages[section]?.length > 0 && (
                                  <div className="mb-4 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
                                    {displayImages[section].map(
                                      (url, index) => (
                                        <div
                                          key={index}
                                          className="group relative aspect-square overflow-hidden rounded-lg border"
                                        >
                                          <Image
                                            src={url}
                                            alt={`Image ${index + 1}`}
                                            fill
                                            className="object-cover"
                                          />
                                          <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            className="absolute right-2 top-2"
                                            onClick={() => {
                                              const newImages = {
                                                ...displayImages
                                              };
                                              newImages[section].splice(
                                                index,
                                                1
                                              );
                                              setDisplayImages(newImages);
                                            }}
                                          >
                                            <X className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      )
                                    )}
                                  </div>
                                )}
                              </FormItem>
                            )}
                          />

                          {/* File uploader for new images */}
                          <FormField
                            control={form.control}
                            name={`otherInformation.${section}.newImages`}
                            render={({ field }) => (
                              <FormItem className="col-span-2">
                                <FormLabel>New Images</FormLabel>
                                <FileUploader
                                  onValueChange={(files) =>
                                    handleFileSelect(files as File[], section)
                                  }
                                  value={
                                    Array.isArray(field.value)
                                      ? field.value
                                      : []
                                  }
                                  maxFiles={5}
                                  maxSize={MAX_FILE_SIZE}
                                  accept={{
                                    'image/*': ['.jpg', '.jpeg', '.png']
                                  }}
                                  multiple={true}
                                />
                                {field.value?.length > 0 && (
                                  <div className="mt-2 text-sm text-muted-foreground">
                                    {field.value.length} files selected. Images
                                    will be uploaded when you submit the form.
                                  </div>
                                )}
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Default language description (English) */}
                          <div className="prose w-full">
                            <p className="mb-2 text-sm font-medium">
                              Default Description (English)
                            </p>
                            <CKEditorComp
                              section={section}
                              value={form.getValues(
                                `otherInformation.${section}.text`
                              )}
                              onChange={handleEditorChange}
                            />
                          </div>

                          {/* Language descriptions */}
                          <div className="mt-8 space-y-8">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-medium">
                                Translations
                              </h3>
                              <div className="flex items-center gap-2">
                                <Select
                                  value={selectedLanguageId || ''}
                                  onValueChange={setSelectedLanguageId}
                                >
                                  <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Select language" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {getAvailableLanguages(section).map(
                                      (lang) => (
                                        <SelectItem
                                          key={lang.value}
                                          value={lang.value}
                                        >
                                          {lang.label}
                                        </SelectItem>
                                      )
                                    )}
                                  </SelectContent>
                                </Select>
                                <Button
                                  type="button"
                                  size="sm"
                                  onClick={() =>
                                    addLanguageDescription(section)
                                  }
                                  disabled={!selectedLanguageId}
                                >
                                  <Plus className="mr-1 h-4 w-4" />
                                  Add Translation
                                </Button>
                              </div>
                            </div>

                            {form
                              .getValues(
                                `otherInformation.${section}.description`
                              )
                              ?.map((desc, index) => (
                                <div
                                  key={index}
                                  className="rounded-lg border p-4"
                                >
                                  <div className="mb-2 flex items-center justify-between">
                                    <h4 className="font-medium">
                                      {getLanguageName(desc.languageRef)}
                                    </h4>
                                    <Button
                                      type="button"
                                      variant="destructive"
                                      size="sm"
                                      onClick={() =>
                                        removeLanguageDescription(
                                          section,
                                          desc.languageRef
                                        )
                                      }
                                    >
                                      <X className="mr-1 h-4 w-4" />
                                      Remove
                                    </Button>
                                  </div>
                                  <CKEditorComp
                                    section={`${section}-${desc.languageRef}`}
                                    value={desc.text || ''}
                                    onChange={(sectionId, data) =>
                                      handleLanguageDescriptionChange(
                                        section,
                                        desc.languageRef,
                                        data
                                      )
                                    }
                                  />
                                </div>
                              ))}
                          </div>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>
            </div>
            <Button type="submit" disabled={isPending}>
              {isPending && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              {cityId === 'new' ? 'Create City' : 'Update City'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

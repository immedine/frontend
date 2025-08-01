'use client';

import { Button } from '@/components/ui/button';
import { FileUploader } from '@/components/file-uploader';
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
import { PhoneInput } from '@/components/ui/phone-input';
import { Textarea } from '@/components/ui/textarea';
import { useConfig, useUpdateConfig } from '@/hooks/settings/use-config';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Image from 'next/image';
import { toast } from 'sonner';
import { useImageUpload } from '@/hooks/common/use-upload';
const MAX_FILE_SIZE = 50000000;
const ACCEPTED_IMAGE_TYPES = ['.jpg', '.jpeg', '.png', '.webp'];

// Type for the form data
export type GlobalConfig = {
  contactInfo: {
    email: string;
    phoneNumber: {
      code: string;
      number: string;
    };
  };
  appUrls: {
    android: string;
    ios: string;
  };
  privacyPolicy: string;
  termsAndConditions: string;
  donate: {
    title: string;
    description: string;
    link: string;
    images: string[];
  };
};

const formSchema = z.object({
  contactInfo: z.object({
    email: z.string().email('Invalid email address'),
    phoneNumber: z.object({
      number: z.string().min(5, 'Phone number is required'),
      code: z.string()
    })
  }),
  appUrls: z.object({
    android: z.string().url('Invalid Android app URL'),
    ios: z.string().url('Invalid iOS app URL')
  }),
  privacyPolicy: z.string().optional(),
  termsAndConditions: z.string().optional(),
  donate: z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    link: z.string().url('Invalid URL'),
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
  })
});

type FormValues = z.infer<typeof formSchema>;

// Sample data - replace with API data later
const SAMPLE_CONFIG: GlobalConfig = {
  contactInfo: {
    email: '',
    phoneNumber: {
      code: '+1',
      number: ''
    }
  },
  appUrls: {
    android: '',
    ios: ''
  },
  privacyPolicy: '',
  termsAndConditions: '',
  donate: {
    title: '',
    description: '',
    link: '',
    images: [],
  }
};

export default function GlobalConfigForm() {

  const { data: configData } = useConfig();
  const [displayImages, setDisplayImages] = React.useState<string[]>(
    []
  );
  const { mutate: uploadImage, isPending: isImageUploading } = useImageUpload();
  const { mutate: updateConfig } = useUpdateConfig();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: SAMPLE_CONFIG
  });

  async function onSubmit(values: FormValues) {
    console.log(values);
    // Add API integration here
    await form.trigger();
    if (values.donate.images.length === 0 && values.donate.newImages && values.donate.newImages?.length === 0) {
      toast.error('Please add atleast one image for donate page');
      return;
    }
    let updatedImages = [...displayImages]; // Start with the current display images

    if (values.donate.newImages && values.donate.newImages?.length > 0) {
      // If new images are uploaded, upload them first
      const uploadedImages = await uploadFiles(values.donate.newImages, uploadImage);
      updatedImages = [...updatedImages, ...uploadedImages]; // Append newly uploaded images
    }

    // Set the updated images to the state
    setDisplayImages(updatedImages);
    console.log('updatedImages', updatedImages);

    try {
      const finalData = {
        supportContactNo: {
          countryCode: values.contactInfo.phoneNumber.code,
          number: values.contactInfo.phoneNumber.number,
        },
        supportEmail: values.contactInfo.email,
        appleStoreLink: values.appUrls.ios,
        playStoreLink: values.appUrls.android,
        privacyPolicy: values.privacyPolicy,
        termsAndConditions: values.termsAndConditions,
        donate: {
          ...values.donate,
          images: updatedImages, // Use the updated images array
        },

      };

      delete finalData.donate.newImages; // Remove newImages from the final data
      console.log('Final data to be submitted:', finalData);

      await updateConfig(finalData); // Call the updateConfig mutation with the final data
      // reset newImages to empty array
      form.setValue('donate.newImages', []);
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error(
        error instanceof Error ? error.message : 'Error submitting form'
      );
    }
  }

  useEffect(() => {
    if (configData?.data) {
      const config = configData.data;
      setDisplayImages(config.donate.images || []);
      form.reset({
        contactInfo: {
          email: config.supportEmail,
          phoneNumber: {
            code: config.supportContactNo.countryCode || '+1',
            number: config.supportContactNo.number
          }
        },
        privacyPolicy: config.privacyPolicy,
        termsAndConditions: config.termsAndConditions,
        appUrls: {
          android: config.playStoreLink,
          ios: config.appleStoreLink
        },
        donate: {
          title: config.donate.title,
          description: config.donate.description,
          link: config.donate.link,
          images: config.donate.images || [],
          newImages: [], // Reset newImages to an empty array
        }
      });
    }
  }, [configData]);

  const uploadFiles = async (files: File[], uploadFn: any) => {
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

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Global Configuration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Contact Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Contact Information</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="contactInfo.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="support@example.com"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactInfo.phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <PhoneInput
                          placeholder="Enter phone number"
                          value={field.value.number}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* App URLs Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">App URLs</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="appUrls.android"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Android App URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://play.google.com/store/apps/..."
                          type="url"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="appUrls.ios"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>iOS App URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://apps.apple.com/app/..."
                          type="url"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Static page Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Static Pages</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="privacyPolicy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Privacy Policy URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter privacy policy URL"
                          type="url"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="termsAndConditions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Terms and Conditions URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter terms and conditions URL"
                          type="url"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Donate Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Donate</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="donate.title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter title for donate page"
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="donate.description"
                  render={({ field }) => (
                    <FormItem>
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

                <FormField
                  control={form.control}
                  name="donate.link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Link for donation</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://donate/..."
                          type="url"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />


                <FormField
                  control={form.control}
                  name="donate.images"
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
                                form.setValue('donate.images', []); // Clear form field for images
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
                                      .getValues('donate.images')
                                      .filter((_, i) => i !== index); // Remove from form state
                                    form.setValue(
                                      'donate.images',
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
                  name="donate.newImages"
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
              </div>
            </div>

            <Button type="submit">Save Changes</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

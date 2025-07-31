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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  useAddFAQ,
  useUpdateFAQ,
  useFAQ
} from '@/hooks/settings/use-faq';
import { useEffect } from 'react';

export type FAQ = {
  id: string;
  question: string;
  answer: string;
};

const formSchema = z.object({
  question: z.string().min(5, 'Question must be at least 5 characters'),
  answer: z.string().min(10, 'Answer must be at least 10 characters')
});

type FormValues = z.infer<typeof formSchema>;

interface FAQFormProps {
  faqId: string;
  pageTitle: string;
}

export default function FAQForm({ faqId, pageTitle }: FAQFormProps) {

  const { mutate: addFAQ, isPending: isAddPending } = useAddFAQ();
  const { mutate: updateFAQ, isPending: isUpdatePending } =
    useUpdateFAQ(faqId);
  const { data: faqData } = useFAQ(faqId);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: '',
      answer: ''
    }
  });

  useEffect(() => {
    if (faqId !== 'new' && faqData?.data) {
      const faq = faqData.data;

      form.reset({
        question: faq.question,
        answer: faq.answer
      });
    }
  }, [faqData, form, faqId]);

  async function onSubmit(values: FormValues) {
    const apiData = {
      question: values.question,
      answer: values.answer,
    };

    if (faqId === 'new') {
      addFAQ(apiData);
    } else {
      updateFAQ(apiData);
    }
  }

  const isPending = isAddPending || isUpdatePending;


  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{pageTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter FAQ question" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="answer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Answer</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter FAQ answer"
                      className="min-h-[100px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isPending}>
              {faqId !== 'new' ? 'Update FAQ' : 'Create FAQ'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

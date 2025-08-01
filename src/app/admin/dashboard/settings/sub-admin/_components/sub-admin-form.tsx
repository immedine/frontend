'use client';

import { Button } from '@/components/ui/button';
import {useEffect, useState} from 'react';
import { useRoles } from '@/hooks/settings/use-role';
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
import { Switch } from '@/components/ui/switch';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { SubAdmin } from './sub-admin-tables/columns';
import {
  useAddSubAdmin,
  useUpdateSubAdmin,
  useSubAdmin
} from '@/hooks/settings/use-sub-admin';
import { toast } from 'sonner';


const formSchema = z.object({
  firstName: z.string().min(2, 'First Name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.string(),
  isBusinessUser: z.boolean().default(false)
  // isActive: z.boolean().default(true)
});

type FormValues = z.infer<typeof formSchema>;

export default function SubAdminForm({
  subAdminId,
  pageTitle
}: {
  subAdminId: string;
  pageTitle: string;
}) {
  const { mutate: addSubAdmin, isPending: isAddPending } = useAddSubAdmin();
  const { mutate: updateSubAdmin, isPending: isUpdatePending } =
    useUpdateSubAdmin(subAdminId);
  const { data: subAdminData } = useSubAdmin(subAdminId);
  const [businessUserSelected, chooseBusinessUser] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      role: '',
      isBusinessUser: false
    }
  });

  const { data: roleData, isLoading } = useRoles({
    skip: 0,
    limit: 0,
    filters: {},
    sortConfig: {}
  });

  const roles = roleData?.data?.data?.length ? roleData?.data?.data.map(each => {
    return {
      id: each._id,
      label: each.name
    }
  }) : [];

  useEffect(() => {
    if (subAdminId !== 'new' && subAdminData?.data) {
      const subAdmin = subAdminData.data;
      
      form.reset({
        firstName: subAdmin.personalInfo.firstName,
        lastName: subAdmin.personalInfo.lastName,
        email: subAdmin.personalInfo.email,
        role: !subAdmin.roleInfo.isBusinessUser && subAdmin.roleInfo.roleId ? subAdmin.roleInfo.roleId._id : "",
        isBusinessUser: subAdmin.roleInfo.isBusinessUser
      });
      if (subAdmin.roleInfo.isBusinessUser) {
        chooseBusinessUser(true);
      }
    }
  }, [subAdminData, form, subAdminId]);

  async function onSubmit(values: FormValues) {
    console.log(values);

    // return
    const apiData = {
      personalInfo: {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email
      },
      roleInfo: {
        isSuperAdmin: false
      }
    };

    if (values.isBusinessUser) {
      apiData.roleInfo.isBusinessUser = true;
    } else {

      toast.error('Please choose a role or select Business user');
      return;


      apiData.roleInfo.roleId = values.role;
    }

    if (subAdminId === "new") {
      addSubAdmin(apiData);
    } else {
      updateSubAdmin(apiData);
    }
    // Add API integration here
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
            <div className="grid gap-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                      disabled={businessUserSelected}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.label}
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
                name="isBusinessUser"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Business User</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={e => {
                          chooseBusinessUser(!businessUserSelected);
                          field.onChange(e);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" disabled={isPending}>
              {subAdminId !== "new" ? 'Update Sub-Admin' : 'Create Sub-Admin'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

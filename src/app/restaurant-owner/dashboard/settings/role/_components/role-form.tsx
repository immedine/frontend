'use client';

import { useEffect } from 'react';

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
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Role } from './role-tables/columns';
import {
  useAddRole,
  useUpdateRole,
  useRole
} from '@/hooks/settings/use-role';

const AVAILABLE_PERMISSIONS = {
  dashboard: {
    label: 'Dashboard'
  },
  story: {
    label: 'Story'
  },
  city: {
    label: 'City'
  },
  route: {
    label: 'Route'
  },
  advertisement: {
    label: 'Advertisement'
  },
  language: {
    label: 'Language'
  },
  category: {
    label: 'Category'
  },
  faq: {
    label: 'FAQ'
  },
  globalConfig: {
    label: 'Global Config'
  },
  notifications: {
    label: 'Notifications'
  },
  subAdmin: {
    label: 'Sub Admin'
  },
  role: {
    label: 'Role'
  }
}

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  permissions: z
    .array(z.string())
    .min(1, 'At least one permission is required'),
  // isActive: z.boolean().default(true)
});

type FormValues = z.infer<typeof formSchema>;

export default function RoleForm({
  roleId,
  pageTitle
}: {
  roleId: string;
  pageTitle: string;
}) {
  const { mutate: addRole, isPending: isAddPending } = useAddRole();
  const { mutate: updateRole, isPending: isUpdatePending } =
    useUpdateRole(roleId);
  const { data: roleData } = useRole(roleId);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      permissions: ['dashboard']
    }
  });

  useEffect(() => {
    if (roleId !== 'new' && roleData?.data) {
      const role = roleData.data;
      
      form.reset({
        name: role.name,
        permissions: role.permissions.map(each => each.moduleKey)
      });
    }
  }, [roleData, form, roleId]);

  async function onSubmit(values: FormValues) {
    // console.log(values);
    const apiData = {
      name: values.name,
      permissions: values.permissions.map(each => {
        return {
          moduleKey: each,
          moduleName: AVAILABLE_PERMISSIONS[each].label,
          role: 2
        }
      })
    };

    // return;
    if (roleId === "new") {
      addRole(apiData);
    } else {
      updateRole(apiData);
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter role name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="permissions"
                render={() => (
                  <FormItem>
                    <FormLabel>Permissions</FormLabel>
                    <div className="grid gap-4 md:grid-cols-2">
                      {Object.keys(AVAILABLE_PERMISSIONS).map((permission) => (
                        <FormField
                          key={permission}
                          control={form.control}
                          name="permissions"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={permission}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(
                                      permission
                                    ) || permission === "dashboard"}
                                    disabled={permission === "dashboard"}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                          ...field.value,
                                          permission
                                        ])
                                        : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== permission
                                          )
                                        );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {AVAILABLE_PERMISSIONS[permission].label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/*<FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active Status</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Enable or disable this role
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
              />*/}
            </div>

            <Button type="submit" disabled={isPending}>
              {roleId !== "new" ? 'Update Role' : 'Create Role'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

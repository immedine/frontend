'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Copy, Edit, MoreHorizontal, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDeleteRole } from '@/hooks/settings/use-role';
import { Role } from './columns';

interface CellActionProps {
  data: Role;
}

export function CellAction({ data }: CellActionProps) {
  const router = useRouter();
  const { mutate: deleteRole, isPending } = useDeleteRole();

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success('Role ID copied to clipboard.');
  };

  const onDelete = async () => {
    deleteRole(data._id);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => onCopy(data._id)}>
          <Copy className="mr-2 h-4 w-4" /> Copy Id
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push(`/dashboard/settings/role/${data._id}`)}
        >
          <Edit className="mr-2 h-4 w-4" /> Update
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDelete} disabled={isPending}>
          <Trash className="mr-2 h-4 w-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

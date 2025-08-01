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
import { Language } from '@/services/language.service';
import { useDeleteLanguage } from '@/hooks/settings/use-language';

interface CellActionProps {
  data: Language;
}

export function CellAction({ data }: CellActionProps) {
  const router = useRouter();
  const { mutate: deleteLanguage, isPending } = useDeleteLanguage();

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success('Language ID copied to clipboard.');
  };

  const onDelete = async () => {
    deleteLanguage(data._id);
  };

  return (
    data.code === "en" ? <></> :
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
          onClick={() =>
            router.push(`/dashboard/settings/language/${data._id}`)
          }
        >
          <Edit className="mr-2 h-4 w-4" /> Update
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onDelete}
          disabled={isPending}
          className="text-red-600 focus:text-red-600"
        >
          <Trash className="mr-2 h-4 w-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

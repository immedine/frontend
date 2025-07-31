'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { getAuthUser } from '@/lib/auth';
import { useLogout } from '@/hooks/profile/use-profile';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export function UserNav() {
  const { mutate: logout, isPending } = useLogout();
  const [userData, setUserData] =
    useState<ReturnType<typeof getAuthUser>>(null);

  useEffect(() => {
    setUserData(getAuthUser());
  }, []);

  const { personalInfo } = userData || {};

  const getInitials = () => {
    if (!personalInfo?.firstName || !personalInfo?.lastName) return '';
    return `${personalInfo.firstName[0]}${personalInfo.lastName[0]}`;
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={personalInfo?.profilePicture}
              alt={personalInfo?.fullName || ''}
            />
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {personalInfo?.fullName}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {personalInfo?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/dashboard/profile">
            <DropdownMenuItem>
              Profile
              {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 focus:text-red-600"
          disabled={isPending}
          onClick={handleLogout}
        >
          Log out
          {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

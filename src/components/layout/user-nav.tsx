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
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { profileService } from '@/services/profile.service';
import Cookies from 'js-cookie';
import { AUTH_TOKEN } from '@/config/cookie-keys';
import { toast } from 'sonner';

export function UserNav() {
  const pathname = usePathname();
  const router = useRouter();
  // const { mutate: logout, isPending } = useLogout();
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

  const handleLogout = async () => {
    const res = await profileService.logout(pathname.split('/')[1]);
    if (res.data) {
      Cookies.remove(AUTH_TOKEN);
      // Show success message
      toast.success('Logged out successfully');
      // Redirect to login
      router.push('/restaurant-owner/auth/sign-in');
    }
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
          <Link href={`/${pathname.split('/')[1]}/dashboard/profile`}>
            <DropdownMenuItem>
              Profile
              {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 focus:text-red-600"
          onClick={handleLogout}
        >
          Log out
          {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

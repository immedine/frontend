'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { getAuthUser } from '@/lib/auth';
import { useEffect, useState } from 'react';

export default function ProfileOverview() {
  // Use state to handle client-side rendering
  const [userData, setUserData] =
    useState<ReturnType<typeof getAuthUser>>(null);

  useEffect(() => {
    setUserData(getAuthUser());
  }, []);

  const { personalInfo, roleInfo, createdAt } = userData || {};

  // Get initials for avatar fallback
  const getInitials = () => {
    if (!personalInfo?.firstName || !personalInfo?.lastName) return '';
    return `${personalInfo.firstName[0]}${personalInfo.lastName[0]}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Overview</CardTitle>
        <CardDescription>Your current profile information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={personalInfo?.profilePicture}
              alt={personalInfo?.fullName || ''}
            />
            <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h3 className="text-2xl font-semibold">
              {personalInfo?.fullName || 'Loading...'}
            </h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>{personalInfo?.email || ''}</p>
              {roleInfo && (
                <p>Role: {roleInfo.isSuperAdmin ? 'Super Admin' : 'Admin'}</p>
              )}
              {personalInfo?.country && <p>Country: {personalInfo.country}</p>}
              <p>
                Member since:{' '}
                {createdAt ? new Date(createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

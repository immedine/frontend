'use client';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail
} from '@/components/ui/sidebar';
import { navItems } from '@/constants/data';
import {
  ChevronRight,
  GalleryVerticalEnd,
} from 'lucide-react';
import { USER_ACCESS } from '@/config/cookie-keys';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';
import { Icons } from '@/components/icons';
import Image from 'next/image';
import { useState, useEffect } from 'react';


export const company = {
  name: 'Roods',
  logo: GalleryVerticalEnd,
  plan: 'Admin'
};

export default function AppSidebar() {
  const pathname = usePathname();
  const [permissions, setPermissions] = useState('');

  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
    };

    const userAccess = getCookie(USER_ACCESS);
    if (userAccess) {
      setPermissions(decodeURIComponent(userAccess));
    }
  }, []);

  const getMenu = () => {
    const localArr = JSON.parse(JSON.stringify(navItems));
    let arr = [];
    if (permissions.includes('superAdmin')) {
      arr = localArr;
    } else {
      localArr.forEach((each) => {
        if (!each.items.length) {
          if (permissions.includes(each.key)) {
            arr.push(each);
          }
        } else {
          let isYes = false;
          const items = [];
          each.items.forEach((each1) => {
            if (permissions.includes(each1.key)) {
              isYes = true;
              items.push(each1);
            }
          });

          if (isYes) {
            each.items = items;
            arr.push(each);
          } else {
            each.items = [];
          }
        }
      });
    }

    return arr;
  };

  if (!permissions) {
    return <div>Loading...</div>;
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex gap-2 py-2 text-sidebar-accent-foreground ">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
            <Image
              src="/roods-logo-icon.png"
              alt="logo"
              width={25}
              height={25}
            />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight items-center">
            <span className="truncate font-semibold">{company.name}</span>
            {/* <span className="truncate text-xs">{company.plan}</span> */}
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="overflow-x-hidden">
        <SidebarGroup>
          <SidebarGroupLabel>Overview</SidebarGroupLabel>
          <SidebarMenu>
            {getMenu().map((item) => {
              const Icon = item.icon ? Icons[item.icon] : Icons.logo;
              return item?.items && item?.items?.length > 0 ? (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={item.isActive}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        isActive={pathname === item.url}
                      >
                        {item.icon && <Icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={pathname === subItem.url}
                            >
                              <Link href={`/${pathname.split('/')[1]}${subItem.url}`}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={pathname === item.url}
                  >
                    <Link href={`/${pathname.split('/')[1]}${item.url}`}>
                      <Icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useBreadcrumbs } from '@/hooks/use-breadcrumbs';
import { Slash } from 'lucide-react';
import { Fragment } from 'react';

export function Breadcrumbs() {
  const items = useBreadcrumbs();
  if (items.length === 0) return null;

  const filteredItems = items.filter((item) => item.title !== 'Dashboard');

  const staticTitles = ['Settings', 'Content'];

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {filteredItems.map((item, index) => (
          <Fragment key={item.title}>

            {index !== filteredItems.length - 1 && (
              <>
                <BreadcrumbItem className="hidden md:block">
                  {staticTitles.includes(item.title) ? (
                    <BreadcrumbPage>{item.title}</BreadcrumbPage> // Non-clickable
                  ) : (
                    <BreadcrumbLink href={item.link}>{item.title}</BreadcrumbLink> // Clickable
                  )}
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block">
                  <Slash />
                </BreadcrumbSeparator>
              </>
            )}

            {index === filteredItems.length - 1 && (
              <BreadcrumbPage>{item.title}</BreadcrumbPage>
            )}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

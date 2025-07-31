'use client';

import * as React from 'react';
import { CalendarIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface DateTimePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  fromDate?: Date;
}

export function DateTimePicker({
  value,
  onChange,
  fromDate
}: DateTimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate && value) {
      // Preserve the current time when selecting a new date
      selectedDate.setHours(value.getHours());
      selectedDate.setMinutes(value.getMinutes());
      onChange?.(selectedDate);
    } else if (selectedDate) {
      // If no previous value, set time to 00:00
      selectedDate.setHours(0);
      selectedDate.setMinutes(0);
      onChange?.(selectedDate);
    }
  };

  const handleTimeChange = (type: 'hour' | 'minute', valueStr: string) => {
    if (value) {
      const newDate = new Date(value);
      if (type === 'hour') {
        newDate.setHours(parseInt(valueStr));
      } else if (type === 'minute') {
        newDate.setMinutes(parseInt(valueStr));
      }
      onChange?.(newDate);
    } else {
      // If no date is selected, create a new date with the selected time
      const newDate = new Date();
      if (type === 'hour') {
        newDate.setHours(parseInt(valueStr));
        newDate.setMinutes(0);
      } else if (type === 'minute') {
        newDate.setHours(0);
        newDate.setMinutes(parseInt(valueStr));
      }
      onChange?.(newDate);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal',
            !value && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? (
            format(value, 'MM/dd/yyyy HH:mm')
          ) : (
            <span>MM/DD/YYYY HH:mm</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="sm:flex">
          <Calendar
            mode="single"
            selected={value}
            onSelect={handleDateSelect}
            initialFocus
            fromDate={fromDate}
          />
          <div className="flex flex-col divide-y sm:h-[300px] sm:flex-row sm:divide-x sm:divide-y-0">
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex p-2 sm:flex-col">
                {hours.reverse().map((hour) => (
                  <Button
                    key={hour}
                    size="icon"
                    variant={
                      value && value.getHours() === hour ? 'default' : 'ghost'
                    }
                    className="aspect-square shrink-0 sm:w-full"
                    onClick={() => handleTimeChange('hour', hour.toString())}
                  >
                    {hour.toString().padStart(2, '0')}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex p-2 sm:flex-col">
                {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                  <Button
                    key={minute}
                    size="icon"
                    variant={
                      value && value.getMinutes() === minute
                        ? 'default'
                        : 'ghost'
                    }
                    className="aspect-square shrink-0 sm:w-full"
                    onClick={() =>
                      handleTimeChange('minute', minute.toString())
                    }
                  >
                    {minute.toString().padStart(2, '0')}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

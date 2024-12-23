// src/components/ui/date-time-picker.tsx
"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateTimePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
}

export function DateTimePicker({ value, onChange }: DateTimePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(value);
  const [time, setTime] = React.useState(
    value ? format(value, "HH:mm") : "12:00",
  );

  React.useEffect(() => {
    if (date && time) {
      const [hours = "0", minutes = "0"] = time.split(":");
      const newDate = new Date(date);
      newDate.setHours(parseInt(hours), parseInt(minutes));
      onChange?.(newDate);
    }
  }, [date, time, onChange]);

  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className="w-full rounded-md border border-input bg-background px-3 py-2"
      />
    </div>
  );
}

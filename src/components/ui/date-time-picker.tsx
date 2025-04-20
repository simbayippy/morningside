"use client";

import * as React from "react";
import { format, parse } from "date-fns";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DateTimePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
}

export function DateTimePicker({ value, onChange }: DateTimePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(value);
  
  // Extract hours, minutes, and period from the value
  const getTimeValues = () => {
    if (!value) return { hours: "12", minutes: "00", period: "PM" };

    console.log(value);
    
    const hours = value.getHours();
    const minutes = value.getMinutes();
    
    let displayHours: string;
    let period: "AM" | "PM";
    
    if (hours === 0) {
      displayHours = "12";
      period = "AM";
    } else if (hours === 12) {
      displayHours = "12";
      period = "PM";
    } else if (hours > 12) {
      displayHours = String(hours - 12).padStart(2, "0");
      period = "PM";
    } else {
      displayHours = String(hours).padStart(2, "0");
      period = "AM";
    }
    
    return {
      hours: displayHours,
      minutes: String(minutes).padStart(2, "0"),
      period
    };
  };
  
  const { hours, minutes, period } = getTimeValues();
  
  const [selectedHours, setSelectedHours] = React.useState(hours);
  const [selectedMinutes, setSelectedMinutes] = React.useState(minutes);
  const [selectedPeriod, setSelectedPeriod] = React.useState(period);

  // Update the date when any time component changes
  React.useEffect(() => {
    if (date) {
      const newDate = new Date(date);
      let hours = parseInt(selectedHours);
      
      // Convert to 24-hour format for internal use
      if (selectedPeriod === "PM" && hours !== 12) {
        hours += 12;
      } else if (selectedPeriod === "AM" && hours === 12) {
        hours = 0;
      }
      
      newDate.setHours(hours, parseInt(selectedMinutes), 0, 0);
      onChange?.(newDate);
    }
  }, [date, selectedHours, selectedMinutes, selectedPeriod, onChange]);

  // Update time state when value changes externally
  React.useEffect(() => {
    if (value) {
      setDate(value);
      const { hours, minutes, period } = getTimeValues();
      setSelectedHours(hours);
      setSelectedMinutes(minutes);
      setSelectedPeriod(period);
    }
  }, [value]);

  // Generate hours options (1-12)
  const hoursOptions = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 1;
    return String(hour).padStart(2, "0");
  });

  // Generate minutes options (00-59)
  const minutesOptions = Array.from({ length: 60 }, (_, i) => {
    return String(i).padStart(2, "0");
  });

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
      
      <div className="flex items-center gap-2">
        {/* Hours */}
        <Select value={selectedHours} onValueChange={setSelectedHours}>
          <SelectTrigger className="w-[70px]">
            <SelectValue placeholder="HH" />
          </SelectTrigger>
          <SelectContent>
            {hoursOptions.map((hour) => (
              <SelectItem key={hour} value={hour}>
                {hour}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <span className="text-center">:</span>
        
        {/* Minutes */}
        <Select value={selectedMinutes} onValueChange={setSelectedMinutes}>
          <SelectTrigger className="w-[70px]">
            <SelectValue placeholder="MM" />
          </SelectTrigger>
          <SelectContent>
            {minutesOptions.map((minute) => (
              <SelectItem key={minute} value={minute}>
                {minute}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* AM/PM */}
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-[70px]">
            <SelectValue placeholder="--" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AM">AM</SelectItem>
            <SelectItem value="PM">PM</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
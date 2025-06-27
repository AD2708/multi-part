
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  onDateSelect?: (date: Date | undefined) => void;
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  onDateSelect,
  ...props
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - 50 + i);

  const handleMonthChange = (monthIndex: string) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(parseInt(monthIndex));
    setCurrentMonth(newDate);
  };

  const handleYearChange = (year: string) => {
    const newDate = new Date(currentMonth);
    newDate.setFullYear(parseInt(year));
    setCurrentMonth(newDate);
  };

  const handlePrevMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(currentMonth.getMonth() - 1);
    setCurrentMonth(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(currentMonth.getMonth() + 1);
    setCurrentMonth(newDate);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  return (
    <div className="p-3">
      {/* Custom Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Select value={currentMonth.getMonth().toString()} onValueChange={handleMonthChange}>
            <SelectTrigger className="w-24 h-8 text-sm [&>svg]:hidden">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {months.map((month, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={currentMonth.getFullYear().toString()} onValueChange={handleYearChange}>
            <SelectTrigger className="w-20 h-8 text-sm [&>svg]:hidden">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white max-h-48">
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Month Display and Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        
        <div className="font-medium text-sm">
          {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </div>
        
        <button
          onClick={handleNextMonth}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Calendar */}
      <DayPicker
        mode="single"
        month={currentMonth}
        onMonthChange={setCurrentMonth}
        showOutsideDays={showOutsideDays}
        selected={props.selected as Date}
        onSelect={handleDateSelect}
        className={cn("pointer-events-auto", className)}
        classNames={{
          months: "flex flex-col space-y-4",
          month: "space-y-4",
          caption: "hidden", // Hide default caption since we have custom header
          nav: "hidden", // Hide default navigation since we have custom navigation
          table: "w-full border-collapse space-y-1",
          head_row: "flex",
          head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem] text-center",
          row: "flex w-full mt-2",
          cell: "h-8 w-8 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
          day: cn(
            buttonVariants({ variant: "ghost" }),
            "h-8 w-8 p-0 font-normal aria-selected:opacity-100 hover:bg-gray-100"
          ),
          day_range_end: "day-range-end",
          day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          day_today: "bg-accent text-accent-foreground font-medium",
          day_outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
          day_disabled: "text-muted-foreground opacity-50",
          day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
          ...classNames,
        }}
        components={{
          IconLeft: () => null, // Hide default icons since we have custom navigation
          IconRight: () => null,
        }}
        {...props}
      />
    </div>
  );
}
Calendar.displayName = "Calendar";

export { Calendar };

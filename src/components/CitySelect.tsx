'use client'

import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCities } from "@/hooks/useCities";
import { useRouter } from 'next/navigation';

export default function CitySelect() {
  const [open, setOpen] = React.useState(false);
  const { cities, loading, error } = useCities();
  const router = useRouter();

  // Default city
  const defaultCity = "";
  const [selectedCity, setSelectedCity] = React.useState<string>(defaultCity);

  React.useEffect(() => {
    router.push(`/`);
  }, [router]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedCity || "Select Your City..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search Your City..." className="h-9" />
          <CommandList>
            <CommandEmpty>No city found.</CommandEmpty>
            <CommandGroup>
              {cities.map((city) => (
                <CommandItem
                  key={city.id+12}
                  value={city.name}
                  onSelect={(currentValue) => {
                    setSelectedCity(currentValue);
                    setOpen(false);
                    router.push(`/events/${currentValue}`); // Navigate to the selected city's events
                  }}
                >
                  {city.name}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedCity === city.name ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

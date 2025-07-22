import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchBoxProps {
  placeholder: string;
  searchFunction: (value: string) => void;
  value?: string;
  className?: string;
  type?: 'simple' | 'instant' | 'default';
}

export const SearchBox = ({ placeholder, searchFunction, value = "", className, type = 'default' }: SearchBoxProps) => {  
  const [inputValue, setInputValue] = useState(value);
  const [badgeValue, setBadgeValue] = useState(value);
  
  // Update internal state when prop value changes
  useEffect(() => {
    setInputValue(value);
    if (type === 'default') {
      setBadgeValue(value);
    }
  }, [value, type]);

  // Handle search based on type
  useEffect(() => {
    if (type === 'instant') {
      const timer = setTimeout(() => {
        searchFunction(inputValue);
      }, 500); // 500ms debounce

      return () => clearTimeout(timer);
    } else if (type === 'default' && inputValue === "") {
      const timer = setTimeout(() => {
        clearSearch();
      }, 500); // 500ms debounce

      return () => clearTimeout(timer);
    }
  }, [inputValue, searchFunction, type]);

  const clearSearch = () => {
    setBadgeValue("");
    searchFunction(""); // Clear search input and badge
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (type === 'default') {
        setBadgeValue(inputValue); // Add badge with entered value when Enter is pressed
      }
      searchFunction(inputValue);
    }
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <Input
          type="search"
          placeholder={placeholder}
          className="pl-10"
          value={inputValue}
          onKeyDown={handleKeyDown}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </div>
      {type === 'default' && badgeValue && 
        <div className="flex items-center gap-2">
          <Badge
            key={badgeValue}
            variant="default"
            className={cn(
              "cursor-pointer text-m",
              'bg-blue-100 text-blue-800 hover:bg-blue-200'
            )}
            onClick={() => clearSearch()}
          >
            {badgeValue}
          </Badge>
          <button
            onClick={clearSearch}
            className="h-4 w-4 rounded-full hover:bg-muted flex items-center justify-center"
            aria-label="Clear search"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      }
    </div>
  );
};


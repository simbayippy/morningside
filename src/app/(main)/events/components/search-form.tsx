"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

interface SearchFormProps {
  defaultValue?: string;
}

export function SearchForm({ defaultValue }: SearchFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams();
    // Preserve existing params
    for (const [key, value] of searchParams) {
      params.set(key, value);
    }

    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }

    const query = params.toString();
    const url = query ? `${pathname}?${query}` : pathname;

    router.push(url);
  }, 300);

  return (
    <div className="mb-8">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          type="search"
          placeholder="Search events..."
          defaultValue={defaultValue}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-10"
        />
      </div>
    </div>
  );
}

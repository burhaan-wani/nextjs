"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Filter } from "lucide-react";
import { FilterOption } from "@/constants/filters";

interface CommonFilterProps {
    filters: FilterOption[];
    placeholder?: string;
    variant?: "select" | "pills";
    paramKey?: string;
    clearOnReselect?: boolean;
    containerClasses?: string;
    otherClasses?: string;
}

const CommonFilter = ({
    filters,
    placeholder = "Select a filter",
    variant = "select",
    paramKey = "filter",
    clearOnReselect = true,
    containerClasses = "",
    otherClasses = "",
}: CommonFilterProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const activeFilter = searchParams.get(paramKey) || "";

    const handleUpdateParams = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (!value || (clearOnReselect && activeFilter === value)) {
            params.delete(paramKey);
        } else {
            params.set(paramKey, value);
        }

        // Reset pagination to page 1 whenever filter changes
        params.delete("page");

        const queryString = params.toString();
        const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

        router.push(newUrl, { scroll: false });
    };

    if (variant === "pills") {
        return (
            <div
                role="group"
                aria-label={placeholder}
                className={`flex flex-wrap items-center gap-2 ${containerClasses}`}
            >
                {filters.map((item) => {
                    const isActive = activeFilter === item.value;
                    return (
                        <button
                            key={item.value}
                            type="button"
                            onClick={() => handleUpdateParams(item.value)}
                            aria-pressed={isActive}
                            className={`rounded-lg border px-3.5 py-2 text-xs font-semibold transition-colors ${
                                isActive
                                    ? "border-[#FF8A00] bg-[#FF8A00]/15 text-[#FF8A00]"
                                    : "border-[#1E293B] bg-[#080F20] text-[#94A3B8] hover:border-[#334155] hover:text-[#F1F5F9]"
                            } ${otherClasses}`}
                        >
                            {item.name}
                        </button>
                    );
                })}
            </div>
        );
    }

    return (
        <div className={`relative ${containerClasses}`}>
            <Filter className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#94A3B8]" />
            <select
                aria-label={placeholder}
                value={activeFilter}
                onChange={(e) => handleUpdateParams(e.target.value)}
                className={`min-h-11 w-full appearance-none rounded-xl border border-[#1E293B] bg-[#080F20] pl-10 pr-9 text-sm font-medium text-[#F1F5F9] outline-none transition-colors hover:border-[#334155] focus:border-[#FF8A00] ${otherClasses}`}
            >
                <option value="" className="bg-[#080F20] text-[#94A3B8]">
                    {placeholder}
                </option>
                {filters.map((item) => (
                    <option
                        key={item.value}
                        value={item.value}
                        className="bg-[#080F20] text-[#F1F5F9]"
                    >
                        {item.name}
                    </option>
                ))}
            </select>
            <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#94A3B8]">
                ▼
            </span>
        </div>
    );
};

export default CommonFilter;

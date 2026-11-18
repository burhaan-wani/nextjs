"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { cn } from "cn"; // or standard clsx / tailwind-merge utils if configured
import { useState } from "react";
import { deleteSearchUrlQuery, formSearchUrlQuery } from "@/lib/url";

const filterOptions = [
    { name: "Newest", value: "newest" },
    { name: "Popular", value: "popular" },
    { name: "Unanswered", value: "unanswered" },
    { name: "Recommended", value: "recommended" },
];

const Filter = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const activeFilter = searchParams.get("filter") || "";
    const [filter, setFilter] = useState(activeFilter);

    const handleFilterClick = (value: string) => {
        let newUrl = "";

        if (value === filter) {
            setFilter("");
            newUrl = deleteSearchUrlQuery({
                query: searchParams.toString(),
                keys: ["filter"],
            });
        } else {
            // Select new filter
            setFilter(value);
            newUrl = formSearchUrlQuery({
                query: searchParams.toString(),
                key: "filter",
                value: value.toLowerCase(),
            });
        }
        router.push(newUrl, { scroll: false });
    };

    return (
        <div className="mt-6 flex items-center gap-3 p-1.5 rounded-xl">
            {filterOptions.map((filter) => {
                const isActive = activeFilter === filter.value;

                return (
                    <button
                        key={filter.value}
                        onClick={() => handleFilterClick(filter.value)}
                        className={cn(
                            // Base styling: clean, minimal, rounded pill
                            "px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer select-none border",
                            // Inactive state styling
                            !isActive &&
                                "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50",
                            // Active state styling: warm orange accent matching your design system
                            isActive &&
                                "bg-orange-500 text-white font-semibold shadow-sm shadow-orange-950/50",
                        )}
                    >
                        {filter.name}
                    </button>
                );
            })}
        </div>
    );
};

export default Filter;

"use client";

import { useEffect, useState } from "react";
import { cn } from "cn";
import { deleteSearchUrlQuery, formSearchUrlQuery } from "@/lib/url";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface SearchBarProps {
    route: string;
    className?: string;
    placeHolder: string;
}

const SearchBar = ({ className = "", placeHolder, route }: SearchBarProps) => {
    const router = useRouter();
    const pathname = usePathname();

    const searchParams = useSearchParams();
    const query = searchParams.get("query") || "";
    const [searchQuery, setSearchQuery] = useState(query);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchQuery) {
                const newUrl = formSearchUrlQuery({
                    query: searchParams.toString(),
                    key: "query",
                    value: searchQuery,
                });
                router.push(newUrl, { scroll: false });
            } else {
                if (pathname === route) {
                    const newUrl = deleteSearchUrlQuery({
                        query: searchParams.toString(),
                        keys: ["query"],
                    });

                    router.push(newUrl, { scroll: false });
                }
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    return (
        <div className="relative flex items-center w-full">
            {/* Search Icon on the Left */}
            <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-500">
                <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>
            </div>

            {/* Input Field with Subtle Border */}
            <input
                type="text"
                placeholder={placeHolder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                    "w-full rounded-lg border border-slate-800 bg-slate-900/50 pl-10 pr-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 shadow-inner transition-all hover:border-slate-700 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20",
                    className,
                )}
            />
        </div>
    );
};

export default SearchBar;

"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    page?: number | string;
    isNext: boolean;
    paramKey?: string;
    containerClasses?: string;
}

const Pagination = ({
    page = 1,
    isNext,
    paramKey = "page",
    containerClasses = "",
}: PaginationProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentPage = Math.max(1, Number(page) || 1);

    // Hide pagination if user is on page 1 and there are no more pages
    if (currentPage === 1 && !isNext) return null;

    const handleNavigation = (direction: "prev" | "next") => {
        const nextPageNumber =
            direction === "prev" ? currentPage - 1 : currentPage + 1;

        if (nextPageNumber < 1) return;

        const params = new URLSearchParams(searchParams.toString());

        if (nextPageNumber === 1) {
            params.delete(paramKey);
        } else {
            params.set(paramKey, String(nextPageNumber));
        }

        const queryString = params.toString();
        const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

        router.push(newUrl, { scroll: true });
    };

    return (
        <nav
            aria-label="Pagination"
            className={`mt-10 flex w-full items-center justify-center gap-3 ${containerClasses}`}
        >
            <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => handleNavigation("prev")}
                aria-label="Previous page"
                className="inline-flex min-h-9.5 items-center gap-1.5 rounded-lg border border-[#1E293B] bg-[#080F20] px-3.5 py-2 text-xs font-semibold text-[#F1F5F9] transition-colors hover:border-[#334155] hover:bg-[#111B30] disabled:cursor-not-allowed disabled:border-[#1E293B]/60 disabled:bg-[#080F20]/50 disabled:text-[#475569]"
            >
                <ChevronLeft className="size-4" />
                <span>Prev</span>
            </button>

            <div className="flex min-h-9.5 min-w-9.5 items-center justify-center rounded-lg border border-[#FF8A00]/50 bg-[#FF8A00]/15 px-3.5 py-2 text-xs font-bold text-[#FF8A00]">
                {currentPage}
            </div>

            <button
                type="button"
                disabled={!isNext}
                onClick={() => handleNavigation("next")}
                aria-label="Next page"
                className="inline-flex min-h-9.5 items-center gap-1.5 rounded-lg border border-[#1E293B] bg-[#080F20] px-3.5 py-2 text-xs font-semibold text-[#F1F5F9] transition-colors hover:border-[#334155] hover:bg-[#111B30] disabled:cursor-not-allowed disabled:border-[#1E293B]/60 disabled:bg-[#080F20]/50 disabled:text-[#475569]"
            >
                <span>Next</span>
                <ChevronRight className="size-4" />
            </button>
        </nav>
    );
};

export default Pagination;

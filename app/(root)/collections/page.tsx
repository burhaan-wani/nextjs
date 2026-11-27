import Link from "next/link";
import { Bookmark } from "lucide-react";

import QuestionCard from "@/components/cards/QuestionCard";
import SearchBar from "@/components/search/SearchBar";
import ROUTES from "@/constants/routes";
import { getSavedQuestions } from "@/lib/actions/collection.action";
import { RouteParams, TQuestion } from "@/types/global";
import { Suspense } from "react";
import Pagination from "@/components/pagination";

const COLLECTION_FILTERS = [
    { label: "Recently Saved", value: "" },
    { label: "Most Recent", value: "mostrecent" },
    { label: "Oldest", value: "oldest" },
    { label: "Most Voted", value: "mostvoted" },
    { label: "Most Answered", value: "mostanswered" },
    { label: "Most Viewed", value: "mostviewed" },
];

export const instant = false;
const Collections = async ({ searchParams }: RouteParams) => {
    const resolvedParams = await searchParams;
    const query =
        typeof resolvedParams?.query === "string" ? resolvedParams.query : "";
    const filter =
        typeof resolvedParams?.filter === "string" ? resolvedParams.filter : "";
    const page = Number(resolvedParams?.page) || 1;
    const pageSize = Number(resolvedParams?.pageSize) || 10;

    const { success, data, error } = await getSavedQuestions({
        query,
        filter,
        page,
        pageSize,
    });

    const questions: TQuestion[] = data?.questions ?? [];
    const isNext = Boolean(data?.isNext);

    const buildPageHref = (targetPage: number) => {
        const params = new URLSearchParams();
        if (query) params.set("query", query);
        if (filter) params.set("filter", filter);
        if (targetPage > 1) params.set("page", String(targetPage));
        const qs = params.toString();
        return qs ? `${ROUTES.COLLECTION}?${qs}` : ROUTES.COLLECTION;
    };

    const buildFilterHref = (targetFilter: string) => {
        const params = new URLSearchParams();
        if (query) params.set("query", query);
        if (targetFilter) params.set("filter", targetFilter);
        const qs = params.toString();
        return qs ? `${ROUTES.COLLECTION}?${qs}` : ROUTES.COLLECTION;
    };

    return (
        <section>
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#F1F5F9]">
                        Saved Questions
                    </h1>
                    <p className="mt-1 text-sm text-[#94A3B8]">
                        Questions you have bookmarked for quick reference.
                    </p>
                </div>
            </div>

            {/* Search & Sort Pills */}
            <div className="mt-6 flex flex-col gap-4">
                <SearchBar
                    route={ROUTES.COLLECTION}
                    className="w-full"
                    placeHolder="Search saved questions..."
                />

                <div className="flex flex-wrap items-center gap-2">
                    <Suspense fallback={<div>Loading...</div>}>
                        {COLLECTION_FILTERS.map((item) => {
                            const isActive = filter === item.value;
                            return (
                                <Link
                                    key={item.label}
                                    href={buildFilterHref(item.value)}
                                    className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                                        isActive
                                            ? "border-[#FF8A00] bg-[#FF8A00]/15 text-[#FF8A00]"
                                            : "border-[#1E293B] bg-[#080F20] text-[#94A3B8] hover:border-[#334155] hover:text-[#F1F5F9]"
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </Suspense>
                </div>
            </div>

            {/* Content */}
            <div className="mt-8">
                {!success ? (
                    <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-6 text-center text-sm text-rose-300">
                        {error?.message || "Failed to load saved questions."}
                    </div>
                ) : questions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-[#1E293B] bg-[#080F20] px-6 py-14 text-center">
                        <div className="flex size-12 items-center justify-center rounded-full bg-[#111B30] text-[#FF8A00] ring-1 ring-[#1E293B]">
                            <Bookmark className="size-5" />
                        </div>

                        <h2 className="mt-4 text-lg font-bold text-[#F1F5F9]">
                            {query
                                ? "No matching saved questions"
                                : "No saved questions yet"}
                        </h2>
                        <p className="mt-1.5 max-w-md text-sm text-[#94A3B8]">
                            {query
                                ? `We couldn't find any bookmarked questions matching "${query}".`
                                : "Click the star icon on any question to bookmark it and build your personal library."}
                        </p>

                        <Link
                            href={ROUTES.HOME}
                            className="mt-6 inline-flex items-center rounded-lg border border-[#FF8A00]/60 bg-[#FF8A00]/15 px-4 py-2 text-sm font-semibold text-[#FF8A00] transition-colors hover:bg-[#FF8A00]/25"
                        >
                            Explore Questions
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col gap-5">
                            <>
                                {questions.map((question) => (
                                    <QuestionCard
                                        key={question._id.toString()}
                                        question={question}
                                    />
                                ))}
                                <Pagination
                                    page={page}
                                    isNext={Boolean(isNext)}
                                />
                            </>
                        </div>

                        {/* Pagination */}
                        {(page > 1 || isNext) && (
                            <div className="mt-8 flex items-center justify-center gap-3">
                                {page > 1 ? (
                                    <Link
                                        href={buildPageHref(page - 1)}
                                        className="rounded-lg border border-[#1E293B] bg-[#080F20] px-4 py-2 text-xs font-semibold text-[#F1F5F9] transition-colors hover:border-[#334155]"
                                    >
                                        Previous
                                    </Link>
                                ) : (
                                    <span className="cursor-not-allowed rounded-lg border border-[#1E293B]/60 bg-[#080F20]/50 px-4 py-2 text-xs font-semibold text-[#475569]">
                                        Previous
                                    </span>
                                )}

                                <span className="rounded-lg border border-[#FF8A00]/40 bg-[#FF8A00]/15 px-3.5 py-2 text-xs font-bold text-[#FF8A00]">
                                    {page}
                                </span>

                                {isNext ? (
                                    <Link
                                        href={buildPageHref(page + 1)}
                                        className="rounded-lg border border-[#1E293B] bg-[#080F20] px-4 py-2 text-xs font-semibold text-[#F1F5F9] transition-colors hover:border-[#334155]"
                                    >
                                        Next
                                    </Link>
                                ) : (
                                    <span className="cursor-not-allowed rounded-lg border border-[#1E293B]/60 bg-[#080F20]/50 px-4 py-2 text-xs font-semibold text-[#475569]">
                                        Next
                                    </span>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
};

export default Collections;

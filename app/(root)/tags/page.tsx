import { Suspense } from "react";
import Link from "next/link";
import ROUTES from "@/constants/routes";
import { getTags } from "@/lib/actions/tag.action";
import { getTagDefinition } from "@/lib/tag-definitions";
import { RouteParams, Tag } from "@/types/global";
import SearchBar from "@/components/search/SearchBar";

interface TagItem {
    _id: string;
    name: string;
    questions?: number;
}

function TagsFallback() {
    return (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
                <div
                    key={index}
                    className="h-44 rounded-xl border border-[#1E293B] bg-[#080F20] p-6"
                />
            ))}
        </div>
    );
}

async function TagsList({ searchParams }: Pick<RouteParams, "searchParams">) {
    const { filter = "", query = "", page, pageSize } = await searchParams;
    const currentPage = Number(page) || 1;
    const currentPageSize = Number(pageSize) || 10;

    const { success, error, data } = await getTags({
        query,
        filter,
        page: currentPage,
        pageSize: currentPageSize,
    });

    const tags: Tag[] = data?.tags ?? [];
    const isNext = Boolean(data?.isNext);

    return (
        <>
            {query && (
                <div className="mb-6 mt-3 flex items-center gap-2 text-sm text-[#94A3B8]">
                    <span>
                        Showing results for{" "}
                        <strong className="font-semibold text-[#F1F5F9]">
                            &ldquo;{query}&rdquo;
                        </strong>
                    </span>
                    <Link
                        href={ROUTES.TAGS}
                        className="rounded-md border border-[#1E293B] bg-[#111B30] px-2.5 py-1 text-xs font-medium text-[#CBD5E1] transition-colors hover:border-[#334155] hover:text-white"
                    >
                        Clear
                    </Link>
                </div>
            )}

            {!success && (
                <div className="mt-8 rounded-xl border border-red-500/30 bg-red-950/20 p-6 text-sm text-red-300">
                    {error?.message ||
                        "Failed to load tags. Please try again later."}
                </div>
            )}

            {success && tags.length === 0 && (
                <div className="mt-8 rounded-xl border border-[#1E293B] bg-[#080F20] p-10 text-center">
                    <h2 className="text-base font-semibold text-[#F1F5F9]">
                        No tags found
                    </h2>
                    <p className="mt-1 text-sm text-[#94A3B8]">
                        {query
                            ? `No tags matched "${query}". Try a different keyword.`
                            : "There are no tags available yet."}
                    </p>
                </div>
            )}

            {success && tags.length > 0 && (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mt-6">
                    {tags.map((tag) => {
                        const tagId = tag._id.toString();
                        const questionCount = tag.questions ?? 0;
                        const definition = getTagDefinition(tag.name);

                        return (
                            <Link
                                key={tagId}
                                href={ROUTES.TAG(tagId)}
                                className="group flex flex-col justify-between rounded-xl border border-[#1E293B] bg-[#080F20] p-6 transition-all duration-200 hover:border-[#334155]"
                            >
                                <div>
                                    <div className="inline-flex items-center rounded-md bg-[#111B30] px-3 py-1.5 text-xs font-semibold tracking-wide text-[#CBD5E1] transition-colors group-hover:bg-[#17243B] group-hover:text-[#FF8A00]">
                                        {tag.name}
                                    </div>

                                    <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-[#94A3B8]">
                                        {definition}
                                    </p>
                                </div>

                                <div className="mt-5 flex items-center gap-2 border-t border-[#1E293B] pt-4 text-sm">
                                    <span className="font-semibold text-[#FF8A00]">
                                        {questionCount}
                                    </span>
                                    <span className="text-[#94A3B8]">
                                        {questionCount === 1
                                            ? "Question"
                                            : "Questions"}
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}

            {success && (currentPage > 1 || isNext) && (
                <div className="mt-8 flex items-center justify-between border-t border-[#1E293B] pt-6 text-sm">
                    <Link
                        href={{
                            pathname: ROUTES.TAGS,
                            query: {
                                ...(query ? { query } : {}),
                                ...(filter ? { filter } : {}),
                                page: Math.max(1, currentPage - 1),
                                pageSize: currentPageSize,
                            },
                        }}
                        aria-disabled={currentPage <= 1}
                        className={`rounded-lg border border-[#1E293B] px-4 py-2 font-medium transition-colors ${
                            currentPage <= 1
                                ? "pointer-events-none opacity-40 text-[#94A3B8]"
                                : "bg-[#080F20] text-[#F1F5F9] hover:border-[#334155]"
                        }`}
                    >
                        Previous
                    </Link>

                    <span className="text-[#94A3B8]">
                        Page{" "}
                        <strong className="font-semibold text-[#F1F5F9]">
                            {currentPage}
                        </strong>
                    </span>

                    <Link
                        href={{
                            pathname: ROUTES.TAGS,
                            query: {
                                ...(query ? { query } : {}),
                                ...(filter ? { filter } : {}),
                                page: currentPage + 1,
                                pageSize: currentPageSize,
                            },
                        }}
                        aria-disabled={!isNext}
                        className={`rounded-lg border border-[#1E293B] px-4 py-2 font-medium transition-colors ${
                            !isNext
                                ? "pointer-events-none opacity-40 text-[#94A3B8]"
                                : "bg-[#080F20] text-[#F1F5F9] hover:border-[#334155]"
                        }`}
                    >
                        Next
                    </Link>
                </div>
            )}
        </>
    );
}

const Tags = ({ searchParams }: RouteParams) => {
    return (
        <section className="mx-auto w-full max-w-6xl px-4 sm:px-2">
            <div>
                <div className="flex justify-between items-center">
                    <h1 className="font-bold text-2xl">All Questions</h1>
                </div>

                <div className="mt-6">
                    <SearchBar
                        route={ROUTES.TAGS}
                        className="w-full"
                        placeHolder="Search by tag name..."
                    />
                </div>
            </div>

            <Suspense fallback={<TagsFallback />}>
                <TagsList searchParams={searchParams} />
            </Suspense>
        </section>
    );
};

export default Tags;

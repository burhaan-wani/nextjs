"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import AnswerCard from "./AnswerCard";
import { IAnswer } from "@/types/global";
import { hasVoted } from "@/lib/actions/vote.action";
import { Suspense } from "react";

interface AnswersSectionProps {
    answers: IAnswer[];
    totalAnswers: number;
    currentFilter?: string;
    hasError?: boolean;
    errorMessage?: string;
}

const AnswersSection = ({
    answers,
    totalAnswers,
    currentFilter = "latest",
    hasError = false,
    errorMessage,
}: AnswersSectionProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const activeFilter =
        currentFilter === "popular" || currentFilter === "oldest"
            ? currentFilter
            : "latest";

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const nextFilter = e.target.value;
        const params = new URLSearchParams(searchParams.toString());

        if (nextFilter === "latest") {
            params.delete("filter");
        } else {
            params.set("filter", nextFilter);
        }

        const queryString = params.toString();
        router.push(queryString ? `${pathname}?${queryString}` : pathname, {
            scroll: false,
        });
    };

    return (
        <section className="mt-8 border-t border-[#1E293B] pt-8">
            {/* Section Header + Sort Select */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-lg font-bold text-[#F1F5F9]">
                    <span className="text-[#FF8A00]">{totalAnswers}</span>{" "}
                    {totalAnswers === 1 ? "Answer" : "Answers"}
                </h2>

                <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
                    <label
                        htmlFor="answer-filter"
                        className="font-medium text-[#CBD5E1]"
                    >
                        Sort by:
                    </label>
                    <select
                        id="answer-filter"
                        name="filter"
                        value={activeFilter}
                        onChange={handleFilterChange}
                        className="rounded-lg border border-[#1E293B] bg-[#111B30] px-3 py-1.5 text-xs font-semibold text-[#F1F5F9] outline-none transition-colors hover:border-[#334155] focus:border-[#FF8A00]"
                    >
                        <option value="latest">Latest</option>
                        <option value="popular">Popular</option>
                        <option value="oldest">Oldest</option>
                    </select>
                </div>
            </div>

            {/* Error State */}
            {hasError && (
                <div className="mt-5 rounded-xl border border-rose-500/30 bg-rose-950/20 p-5 text-sm text-rose-300">
                    {errorMessage || "Unable to load answers right now."}
                </div>
            )}

            {/* Empty State */}
            {!hasError && answers.length === 0 && (
                <div className="mt-5 rounded-xl border border-[#1E293B] bg-[#0B1326] p-8 text-center">
                    <p className="text-sm font-semibold text-[#F1F5F9]">
                        No answers yet
                    </p>
                    <p className="mt-1 text-xs text-[#94A3B8]">
                        Be the first developer to share a solution or
                        explanation for this question below.
                    </p>
                </div>
            )}

            {/* Answers List */}
            {!hasError && answers.length > 0 && (
                <div className="mt-5 space-y-4">
                    {answers.map((answer) => (
                        <Suspense
                            key={answer._id.toString()}
                            fallback={<div>Loading...</div>}
                        >
                            <AnswerCard
                                answer={answer}
                                initialUpvotes={answer.upvotes ?? 0}
                                initialDownvotes={answer.downvotes ?? 0}
                                targetType="answer"
                            />
                        </Suspense>
                    ))}
                </div>
            )}
        </section>
    );
};

export default AnswersSection;

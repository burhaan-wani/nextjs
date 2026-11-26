"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Star } from "lucide-react";
import { toast } from "sonner";

import { TQuestion } from "@/types/global";
import MetricTimestamp from "./MetricTimestamp";
import ROUTES from "@/constants/routes";
import TagCard from "../TagCard";
import {
    addToCollections,
    hasSavedQuestion,
} from "@/lib/actions/collection.action";

interface QuestionCardProps {
    question: TQuestion;
}

const QuestionCard = ({ question }: QuestionCardProps) => {
    const { _id, title, author, tags, createdAt, views, answers, upvotes } =
        question;

    const { data: sessionData, status } = useSession();
    const userId = sessionData?.user?.id;
    const isAuthenticated = status === "authenticated" && Boolean(userId);

    const [isSaved, setIsSaved] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const questionId = _id.toString();

    useEffect(() => {
        if (!isAuthenticated || !userId) {
            setIsSaved(false);
            return;
        }

        let cancelled = false;

        const loadSavedStatus = async () => {
            try {
                const res = await hasSavedQuestion({ id: questionId });

                if (!cancelled) {
                    setIsSaved(Boolean(res?.success && res.data?.saved));
                }
            } catch {
                if (!cancelled) {
                    setIsSaved(false);
                }
            }
        };

        loadSavedStatus();

        return () => {
            cancelled = true;
        };
    }, [questionId, isAuthenticated, userId]);

    const handleAddToCollection = async () => {
        if (!isAuthenticated) {
            toast.error("Only logged in user can save to collection.");
            return;
        }
        if (loading) return;

        setLoading(true);
        try {
            const { success, data, error } = await addToCollections({
                id: questionId,
            });

            if (success) {
                const nextSaved = Boolean(data?.saved);
                setIsSaved(nextSaved);
                toast.success(
                    nextSaved
                        ? "Added to collections"
                        : "Removed from collections",
                );
            } else {
                toast.error(error?.message || "Failed to update collection");
            }
        } catch {
            toast.error("Failed to update collection");
        } finally {
            setLoading(false);
        }
    };

    const showSaved = isAuthenticated && isSaved;

    return (
        <article className="rounded-xl border border-[#1E293B] bg-[#080F20] p-6 sm:p-7 transition-all duration-200 hover:border-[#334155]">
            <div className="flex justify-between items-start gap-3">
                <Link
                    href={ROUTES.QUESTION(questionId)}
                    className="group block"
                >
                    <h3 className="line-clamp-2 text-[17px] font-semibold leading-6 text-[#F1F5F9] transition-colors group-hover:text-[#FF8A00]">
                        {title}
                    </h3>
                </Link>

                <button
                    type="button"
                    disabled={loading}
                    onClick={handleAddToCollection}
                    aria-pressed={showSaved}
                    aria-label={
                        showSaved
                            ? "Remove from collection"
                            : "Save to collection"
                    }
                    className="shrink-0 rounded-md p-1 text-[#94A3B8] transition-colors hover:bg-[#111B30] hover:text-[#FF8A00] disabled:opacity-50"
                >
                    <Star
                        fill={showSaved ? "#FF8A00" : "none"}
                        className={`h-4 w-4 ${showSaved ? "text-[#FF8A00]" : ""}`}
                    />
                </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
                {tags.map((tag) => (
                    <TagCard
                        key={tag._id.toString()}
                        _id={tag._id.toString()}
                        tagName={tag.name}
                        compact
                    />
                ))}
            </div>

            {/* Footer */}
            <div className="mt-5 flex w-full flex-wrap items-center justify-between gap-4 border-t border-[#1E293B] pt-4">
                {/* Author */}
                <div className="flex items-center gap-2">
                    <Link
                        href={ROUTES.PROFILE(author._id.toString())}
                        className="flex gap-2 items-center text-sm"
                    >
                        {author.image ? (
                            <Image
                                src={author.image}
                                alt={author.name}
                                width={28}
                                height={28}
                                className="size-7 rounded-full object-cover"
                            />
                        ) : (
                            <div className="flex size-7 items-center justify-center rounded-full bg-[#1E293B] text-xs font-semibold text-[#F1F5F9]">
                                {author.name?.[0]?.toUpperCase() ?? "?"}
                            </div>
                        )}

                        <span className="font-semibold text-[#F1F5F9]">
                            {author.name}
                        </span>
                    </Link>
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span className="text-[#475569]">•</span>

                        <span className="text-[#94A3B8]">
                            asked <MetricTimestamp createdAt={createdAt} />
                        </span>
                    </div>
                </div>

                {/* Metrics */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                    {[
                        { label: "Votes", value: upvotes },
                        { label: "Answers", value: answers },
                        { label: "Views", value: views },
                    ].map((metric) => (
                        <div
                            key={metric.label}
                            className="flex items-center gap-1.5"
                        >
                            <span className="font-semibold text-[#F1F5F9]">
                                {metric.value}
                            </span>
                            <span className="text-[#94A3B8]">
                                {metric.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </article>
    );
};

export default QuestionCard;

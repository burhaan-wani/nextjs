"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import ROUTES from "@/constants/routes";
import MarkdownContent from "@/components/questions/MarkdownContent";
import MetricTimestamp from "../cards/MetricTimestamp";
import { IAnswer } from "@/types/global";

export interface AnswerItem {
    _id: string;
    content: string;
    upvotes?: number;
    downvotes?: number;
    createdAt: string | Date;
    author: {
        _id: string;
        name: string;
        image?: string;
    };
}

interface AnswerCardProps {
    answer: IAnswer;
    onUpvote?: (answerId: string) => Promise<{ success: boolean } | void>;
    onDownvote?: (answerId: string) => Promise<{ success: boolean } | void>;
}

const AnswerCard = ({ answer, onUpvote, onDownvote }: AnswerCardProps) => {
    const [upvotes, setUpvotes] = useState(answer.upvotes ?? 0);
    const [downvotes, setDownvotes] = useState(answer.downvotes ?? 0);
    const [voteState, setVoteState] = useState<"up" | "down" | null>(null);
    const [isPending, startTransition] = useTransition();

    const answerId = answer._id.toString();
    const authorId = answer.author?._id?.toString() ?? "";
    const authorInitial = answer.author?.name?.[0]?.toUpperCase() ?? "?";

    const handleUpvote = () => {
        startTransition(async () => {
            const prevUp = upvotes;
            const prevDown = downvotes;
            const prevState = voteState;

            if (voteState === "up") {
                setVoteState(null);
                setUpvotes((v) => Math.max(0, v - 1));
            } else {
                setVoteState("up");
                setUpvotes((v) => v + 1);
                if (voteState === "down") {
                    setDownvotes((v) => Math.max(0, v - 1));
                }
            }

            try {
                await onUpvote?.(answerId);
            } catch {
                setUpvotes(prevUp);
                setDownvotes(prevDown);
                setVoteState(prevState);
            }
        });
    };

    const handleDownvote = () => {
        startTransition(async () => {
            const prevUp = upvotes;
            const prevDown = downvotes;
            const prevState = voteState;

            if (voteState === "down") {
                setVoteState(null);
                setDownvotes((v) => Math.max(0, v - 1));
            } else {
                setVoteState("down");
                setDownvotes((v) => v + 1);
                if (voteState === "up") {
                    setUpvotes((v) => Math.max(0, v - 1));
                }
            }

            try {
                await onDownvote?.(answerId);
            } catch {
                setUpvotes(prevUp);
                setDownvotes(prevDown);
                setVoteState(prevState);
            }
        });
    };

    return (
        <div className="rounded-xl border border-[#1E293B] bg-[#0B1326] p-5 sm:p-6">
            {/* Answer Header: Author + Votes */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1E293B] pb-4">
                <Link
                    href={authorId ? ROUTES.PROFILE(authorId) : "#"}
                    className="inline-flex items-center gap-3 text-sm"
                >
                    {answer.author?.image ? (
                        <Image
                            src={answer.author.image}
                            alt={answer.author.name}
                            width={32}
                            height={32}
                            className="size-8 rounded-full object-cover"
                        />
                    ) : (
                        <div className="flex size-8 items-center justify-center rounded-full bg-[#111B30] text-xs font-semibold text-[#FF8A00] ring-1 ring-[#1E293B]">
                            {authorInitial}
                        </div>
                    )}

                    <div>
                        <p className="font-semibold text-[#F1F5F9] transition-colors hover:text-[#FF8A00]">
                            {answer.author?.name ?? "Anonymous"}
                        </p>
                        <p className="text-xs text-[#94A3B8]">
                            Answered{" "}
                            <MetricTimestamp createdAt={answer.createdAt} />
                        </p>
                    </div>
                </Link>

                {/* Upvote / Downvote Controls */}
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        disabled={isPending}
                        onClick={handleUpvote}
                        aria-pressed={voteState === "up"}
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors disabled:opacity-50 ${
                            voteState === "up"
                                ? "border-[#FF8A00] bg-[#FF8A00]/15 text-[#FF8A00]"
                                : "border-[#1E293B] bg-[#111B30] text-[#CBD5E1] hover:border-[#334155] hover:text-white"
                        }`}
                    >
                        <span>▲</span>
                        <span>Upvote</span>
                        <span className="rounded bg-[#080F20] px-1.5 py-0.5 text-[11px] text-[#F1F5F9]">
                            {upvotes}
                        </span>
                    </button>

                    <button
                        type="button"
                        disabled={isPending}
                        onClick={handleDownvote}
                        aria-pressed={voteState === "down"}
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors disabled:opacity-50 ${
                            voteState === "down"
                                ? "border-rose-500/70 bg-rose-500/15 text-rose-300"
                                : "border-[#1E293B] bg-[#111B30] text-[#CBD5E1] hover:border-[#334155] hover:text-white"
                        }`}
                    >
                        <span>▼</span>
                        <span>Downvote</span>
                        <span className="rounded bg-[#080F20] px-1.5 py-0.5 text-[11px] text-[#F1F5F9]">
                            {downvotes}
                        </span>
                    </button>
                </div>
            </div>

            {/* Answer Body */}
            <div className="mt-4">
                <MarkdownContent content={answer.content} />
            </div>
        </div>
    );
};

export default AnswerCard;

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import ROUTES from "@/constants/routes";
import MarkdownContent from "@/components/questions/MarkdownContent";
import MetricTimestamp from "../cards/MetricTimestamp";
import { IAnswer } from "@/types/global";
import { createVote, hasVoted } from "@/lib/actions/vote.action";

interface AnswerCardProps {
    answer: IAnswer;
    initialUpvotes?: number;
    initialDownvotes?: number;
    targetType?: "question" | "answer";
}

const AnswerCard = ({
    answer,
    initialUpvotes,
    initialDownvotes,
    targetType = "answer",
}: AnswerCardProps) => {
    const router = useRouter();
    const { data: sessionData, status } = useSession();

    const currentUserId = sessionData?.user?.id;
    const isAuthenticated =
        status === "authenticated" && Boolean(currentUserId);

    const serverUpvotes = initialUpvotes ?? answer.upvotes ?? 0;
    const serverDownvotes = initialDownvotes ?? answer.downvotes ?? 0;

    const [upvotes, setUpvotes] = useState<number>(serverUpvotes);
    const [downvotes, setDownvotes] = useState<number>(serverDownvotes);
    const [hasUpvoted, setHasUpvoted] = useState<boolean>(false);
    const [hasDownvoted, setHasDownvoted] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const answerId = answer._id.toString();
    const answerAuthorId = answer.author?._id?.toString();
    const authorInitial = answer.author?.name?.[0]?.toUpperCase() ?? "?";

    // Sync real counts from server whenever props update
    useEffect(() => {
        setUpvotes(serverUpvotes);
    }, [serverUpvotes]);

    useEffect(() => {
        setDownvotes(serverDownvotes);
    }, [serverDownvotes]);

    // Load user's vote status only when authenticated; wipe immediately when not
    useEffect(() => {
        if (!isAuthenticated || !currentUserId) {
            setHasUpvoted(false);
            setHasDownvoted(false);
            return;
        }

        let isCurrent = true;
        const activeUserId = currentUserId;

        const loadVoteState = async () => {
            try {
                const res = await hasVoted({
                    targetId: answerId,
                    targetType: "answer",
                });

                if (
                    !isCurrent ||
                    status !== "authenticated" ||
                    sessionData?.user?.id !== activeUserId
                ) {
                    return;
                }

                if (res?.success && res.data) {
                    setHasUpvoted(Boolean(res.data.hasUpvoted));
                    setHasDownvoted(Boolean(res.data.hasDownvoted));
                } else {
                    setHasUpvoted(false);
                    setHasDownvoted(false);
                }
            } catch {
                if (isCurrent) {
                    setHasUpvoted(false);
                    setHasDownvoted(false);
                }
            }
        };

        loadVoteState();

        return () => {
            isCurrent = false;
        };
    }, [
        answerId,
        isAuthenticated,
        currentUserId,
        status,
        sessionData?.user?.id,
    ]);

    const handleVote = async (voteType: "upvote" | "downvote") => {
        if (!isAuthenticated) {
            toast.error("Only logged in user can vote.");
            return;
        }

        setLoading(true);
        try {
            const result = await createVote({
                targetId: answerId,
                targetType,
                voteType,
            });

            if (!result.success) {
                toast.error(result.error?.message || "Failed to vote");
                return;
            }

            if (voteType === "upvote") {
                if (hasUpvoted) {
                    setUpvotes((prev) => Math.max(0, prev - 1));
                    setHasUpvoted(false);
                    toast.success("Upvote removed successfully");
                } else {
                    setUpvotes((prev) => prev + 1);
                    setHasUpvoted(true);
                    if (hasDownvoted) {
                        setDownvotes((prev) => Math.max(0, prev - 1));
                        setHasDownvoted(false);
                    }
                    toast.success("Upvote added successfully");
                }
            } else {
                if (hasDownvoted) {
                    setDownvotes((prev) => Math.max(0, prev - 1));
                    setHasDownvoted(false);
                    toast.success("Downvote removed");
                } else {
                    setDownvotes((prev) => prev + 1);
                    setHasDownvoted(true);
                    if (hasUpvoted) {
                        setUpvotes((prev) => Math.max(0, prev - 1));
                        setHasUpvoted(false);
                    }
                    toast.success("Downvote added");
                }
            }

            router.refresh();
        } catch {
            toast.error("Failed to vote");
        } finally {
            setLoading(false);
        }
    };

    const showUpvoted = isAuthenticated && hasUpvoted;
    const showDownvoted = isAuthenticated && hasDownvoted;

    return (
        <div className="rounded-xl border border-[#1E293B] bg-[#0B1326] p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1E293B] pb-4">
                <Link
                    href={answerAuthorId ? ROUTES.PROFILE(answerAuthorId) : "#"}
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

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        disabled={loading}
                        onClick={() => handleVote("upvote")}
                        aria-pressed={showUpvoted}
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors disabled:opacity-50 ${
                            showUpvoted
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
                        disabled={loading}
                        onClick={() => handleVote("downvote")}
                        aria-pressed={showDownvoted}
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors disabled:opacity-50 ${
                            showDownvoted
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

            <div className="mt-4">
                <MarkdownContent content={answer.content} />
            </div>
        </div>
    );
};

export default AnswerCard;

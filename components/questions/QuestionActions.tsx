"use client";

import { createVote } from "@/lib/actions/vote.action";
import { ActionResponse, HasVotedResponse } from "@/types/global";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";

interface QuestionActionsProps {
    hasVotedPromise: Promise<ActionResponse<HasVotedResponse>>;
    questionId: string;
    initialUpvotes: number;
    initialDownvotes: number;
    targetType: "question" | "answer";
}

const QuestionActions = ({
    hasVotedPromise,
    questionId,
    initialUpvotes,
    initialDownvotes,
    targetType,
}: QuestionActionsProps) => {
    const router = useRouter();
    const { data: sessionData, status } = useSession();
    const userId = sessionData?.user?.id;
    const isLoggedIn = Boolean(userId);

    const { data: hasVotedData } = use(hasVotedPromise);

    const [upvotes, setUpvotes] = useState(initialUpvotes);
    const [downvotes, setDownvotes] = useState(initialDownvotes);

    // Only treat vote state as active when a user is logged in
    const [hasUpvoted, setHasUpvoted] = useState(
        isLoggedIn ? Boolean(hasVotedData?.hasUpvoted) : false,
    );
    const [hasDownvoted, setHasDownvoted] = useState(
        isLoggedIn ? Boolean(hasVotedData?.hasDownvoted) : false,
    );
    const [loading, setLoading] = useState(false);

    // Always sync real counts from server props
    useEffect(() => {
        setUpvotes(initialUpvotes);
    }, [initialUpvotes]);

    useEffect(() => {
        setDownvotes(initialDownvotes);
    }, [initialDownvotes]);

    // Reset active vote highlight if logged out or session changes
    useEffect(() => {
        if (status === "loading") return;

        if (!isLoggedIn) {
            setHasUpvoted(false);
            setHasDownvoted(false);
        } else {
            setHasUpvoted(Boolean(hasVotedData?.hasUpvoted));
            setHasDownvoted(Boolean(hasVotedData?.hasDownvoted));
        }
    }, [isLoggedIn, status, hasVotedData]);

    const handleVote = async (voteType: "upvote" | "downvote") => {
        if (!isLoggedIn) {
            toast.error("Only logged in user can vote.");
            return;
        }

        setLoading(true);
        try {
            const result = await createVote({
                targetId: questionId,
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

            // Re-sync with server-rendered counts from the DB
            router.refresh();
        } catch {
            toast.error("Failed to vote");
        } finally {
            setLoading(false);
        }
    };

    const showUpvoted = isLoggedIn && hasUpvoted;
    const showDownvoted = isLoggedIn && hasDownvoted;

    return (
        <div className="flex flex-wrap items-center gap-2">
            {/* Upvote */}
            <button
                type="button"
                disabled={loading}
                onClick={() => handleVote("upvote")}
                aria-pressed={showUpvoted}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50 ${
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

            {/* Downvote */}
            <button
                type="button"
                disabled={loading}
                onClick={() => handleVote("downvote")}
                aria-pressed={showDownvoted}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50 ${
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
    );
};

export default QuestionActions;

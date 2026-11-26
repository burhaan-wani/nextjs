"use client";

import { createVote } from "@/lib/actions/vote.action";
import { ActionResponse, HasVotedResponse } from "@/types/global";
import { useSession } from "next-auth/react";
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
    const { data: hasVotedData } = use(hasVotedPromise);

    const [upvotes, setUpvotes] = useState(initialUpvotes);
    const [downvotes, setDownvotes] = useState(initialDownvotes);
    const [hasUpvoted, setHasUpvoted] = useState(
        Boolean(hasVotedData?.hasUpvoted),
    );
    const [hasDownvoted, setHasDownvoted] = useState(
        Boolean(hasVotedData?.hasDownvoted),
    );
    const [loading, setLoading] = useState(false);

    const session = useSession();
    const userId = session?.data?.user?.id;

    useEffect(() => {
        setUpvotes(initialUpvotes);
    }, [initialUpvotes]);

    useEffect(() => {
        setDownvotes(initialDownvotes);
    }, [initialDownvotes]);

    const handleVote = async (voteType: "upvote" | "downvote") => {
        if (!userId) {
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
        } catch {
            toast.error("Failed to vote");
        } finally {
            setLoading(false);
        }
    }; // ✅ handleVote closes here

    // ✅ Component return is at the top level of QuestionActions
    return (
        <div className="flex flex-wrap items-center gap-2">
            {/* Upvote */}
            <button
                type="button"
                disabled={loading}
                onClick={() => handleVote("upvote")}
                aria-pressed={hasUpvoted}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50 ${
                    hasUpvoted
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
                aria-pressed={hasDownvoted}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50 ${
                    hasDownvoted
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

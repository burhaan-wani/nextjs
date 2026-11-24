"use client";

import { useState, useTransition } from "react";

interface QuestionActionsProps {
    questionId: string;
    initialUpvotes: number;
    initialDownvotes: number;
    initialSaved?: boolean;
    onUpvote?: (questionId: string) => Promise<{ success: boolean } | void>;
    onDownvote?: (questionId: string) => Promise<{ success: boolean } | void>;
    onToggleSave?: (
        questionId: string,
    ) => Promise<{ success: boolean; saved?: boolean } | void>;
}

const QuestionActions = ({
    questionId,
    initialUpvotes,
    initialDownvotes,
    initialSaved = false,
    onUpvote,
    onDownvote,
    onToggleSave,
}: QuestionActionsProps) => {
    const [upvotes, setUpvotes] = useState(initialUpvotes);
    const [downvotes, setDownvotes] = useState(initialDownvotes);
    const [voteState, setVoteState] = useState<"up" | "down" | null>(null);
    const [saved, setSaved] = useState(initialSaved);
    const [isPending, startTransition] = useTransition();

    const handleUpvote = () => {
        startTransition(async () => {
            const prevUpvotes = upvotes;
            const prevDownvotes = downvotes;
            const prevVote = voteState;

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
                await onUpvote?.(questionId);
            } catch {
                setUpvotes(prevUpvotes);
                setDownvotes(prevDownvotes);
                setVoteState(prevVote);
            }
        });
    };

    const handleDownvote = () => {
        startTransition(async () => {
            const prevUpvotes = upvotes;
            const prevDownvotes = downvotes;
            const prevVote = voteState;

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
                await onDownvote?.(questionId);
            } catch {
                setUpvotes(prevUpvotes);
                setDownvotes(prevDownvotes);
                setVoteState(prevVote);
            }
        });
    };

    const handleSave = () => {
        startTransition(async () => {
            const prevSaved = saved;
            setSaved(!prevSaved);

            try {
                const res = await onToggleSave?.(questionId);
                if (res && typeof res.saved === "boolean") {
                    setSaved(res.saved);
                }
            } catch {
                setSaved(prevSaved);
            }
        });
    };

    return (
        <div className="flex flex-wrap items-center gap-2">
            {/* Upvote */}
            <button
                type="button"
                disabled={isPending}
                onClick={handleUpvote}
                aria-pressed={voteState === "up"}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50 ${
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

            {/* Downvote */}
            <button
                type="button"
                disabled={isPending}
                onClick={handleDownvote}
                aria-pressed={voteState === "down"}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50 ${
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

            {/* Add to Collection */}
            <button
                type="button"
                disabled={isPending}
                onClick={handleSave}
                aria-pressed={saved}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50 ${
                    saved
                        ? "border-amber-400/70 bg-amber-400/15 text-amber-300"
                        : "border-[#1E293B] bg-[#111B30] text-[#CBD5E1] hover:border-[#334155] hover:text-white"
                }`}
            >
                <span>{saved ? "★" : "☆"}</span>
                <span>{saved ? "Saved" : "Save to Collection"}</span>
            </button>
        </div>
    );
};

export default QuestionActions;

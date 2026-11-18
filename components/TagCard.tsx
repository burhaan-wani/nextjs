import ROUTES from "@/constants/routes";
import Link from "next/link";

interface TagCardProps {
    _id: string;
    tagName: string;
    totalQuestions?: number;
    compact?: boolean;
    showCount?: boolean;
}

const TagCard = ({
    _id,
    tagName,
    totalQuestions,
    compact = false,
    showCount = true,
}: TagCardProps) => {
    return (
        <Link
            href={ROUTES.TAGS(_id)}
            className="group flex items-center justify-between rounded-lg space-y-3"
        >
            <span className="inline-flex items-center rounded-md bg-orange-500/10 px-2 py-0.5 text-xs font-medium text-orange-400 group-hover:bg-orange-500/20">
                #{tagName}
            </span>

            {showCount && totalQuestions !== undefined && !compact && (
                <span className="text-[11px] text-slate-500 font-mono">
                    {totalQuestions}
                    {totalQuestions > 1 ? "+" : ""}
                </span>
            )}
        </Link>
    );
};

export default TagCard;

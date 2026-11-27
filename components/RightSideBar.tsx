import Link from "next/link";
import TagCard from "./TagCard";

import ROUTES from "@/constants/routes";
import { getPopularQuestion } from "@/lib/actions/question.action";
import { getPopularTags } from "@/lib/actions/tag.action";

const RightSideBar = async () => {
    const { success, data: TopQuestions, error } = await getPopularQuestion();
    const {
        success: TagSuccess,
        data: TopTags,
        error: TagError,
    } = await getPopularTags();
    return (
        <aside className="sticky top-16 hidden xl:flex flex-col h-[calc(100vh-4rem)] w-85 border-l border-slate-800/80 bg-slate-900/30 p-6 text-sm text-slate-400 gap-8 overflow-y-auto">
            {/* Section 1: Top Questions */}
            <div className="flex flex-col gap-4">
                <h3 className="font-semibold text-slate-200 tracking-wide text-xs uppercase text-slate-400">
                    Top Questions
                </h3>
                <div className="flex flex-col gap-4">
                    {TopQuestions &&
                        TopQuestions.length > 0 &&
                        TopQuestions.map((question) => (
                            <Link
                                key={question._id.toString()}
                                href={ROUTES.QUESTION(question._id.toString())}
                                className="group flex items-center justify-between gap-3 text-slate-300 hover:text-orange-400 transition-colors text-xs leading-relaxed"
                            >
                                <span className="line-clamp-2">
                                    {question.title}
                                </span>
                                <svg
                                    className="h-4 w-4 shrink-0 text-slate-500 transition-transform group-hover:translate-x-0.5 group-hover:text-orange-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </Link>
                        ))}
                </div>
            </div>

            {/* Section 2: Top Tags */}
            <div className="flex flex-col gap-4 mt-15">
                <h3 className="font-semibold text-slate-400 tracking-wide text-xs uppercase text-slate-400">
                    Popular Tags
                </h3>
                <div className="flex flex-col gap-2">
                    {TopTags &&
                        TopTags.length > 0 &&
                        TopTags.map((tag) => (
                            <TagCard
                                key={tag._id.toString()}
                                _id={tag._id.toString()}
                                tagName={tag.name}
                                totalQuestions={tag.questions}
                                showCount={true}
                                compact={false}
                            />
                        ))}
                </div>
            </div>
        </aside>
    );
};

export default RightSideBar;

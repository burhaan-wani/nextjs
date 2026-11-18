import Link from "next/link";
import Image from "next/image";
import { Question } from "@/types/global";
import MetricTimestamp from "./MetricTimestamp";
import ROUTES from "@/constants/routes";
import TagCard from "../TagCard";

interface QuestionCardProps {
    question: Question;
}

const QuestionCard = ({ question }: QuestionCardProps) => {
    const {
        _id,
        title,
        description,
        author,
        tags,
        createdAt,
        views,
        answers,
        upvotes,
    } = question;

    return (
        <article className="rounded-xl border border-[#1E293B] bg-[#080F20] p-6 sm:p-7 transition-all duration-200 hover:border-[#334155]">
            <Link href={ROUTES.QUESTION(_id)} className="group block">
                <h3 className="line-clamp-2 text-[17px] font-semibold leading-6 text-[#F1F5F9] transition-colors group-hover:text-[#FF8A00]">
                    {title}
                </h3>
            </Link>

            <p className="mt-4 line-clamp-2 text-[15px] leading-normal text-[#94A3B8]">
                {description}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
                {tags.map((tag) => (
                    // <span
                    //     key={tag._id}
                    //     className="rounded-md bg-[#111B30] px-3 py-1.5 text-xs font-semibold text-[#CBD5E1] transition-colors hover:bg-[#17243B]"
                    // >
                    //     {tag.name}
                    // </span>
                    <TagCard
                        key={tag._id}
                        _id={tag._id}
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
                        href={ROUTES.PROFILE(author._id)}
                        className="flex gap-2 items-center text-sm"
                    >
                        <Image
                            src={author.image}
                            alt={author.name}
                            width={28}
                            height={28}
                            className="size-7 rounded-full object-cover"
                        />

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

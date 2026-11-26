import { Suspense, type ComponentType } from "react";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { RouteParams } from "@/types/global";
import {
    getQuestion,
    getQuestionsAllAnswers,
    incrementViews,
} from "@/lib/actions/question.action";
import ROUTES from "@/constants/routes";
import TagCard from "@/components/TagCard";
import MarkdownContent from "@/components/questions/MarkdownContent";
import QuestionActions from "@/components/questions/QuestionActions";
import MetricTimestamp from "@/components/cards/MetricTimestamp";
import { after } from "next/server";
import AnswerForm from "@/components/answer/AnswerForm";
import AnswersSection from "@/components/answer/AnswerSection";
import { hasVoted } from "@/lib/actions/vote.action";

function QuestionDetailsFallback() {
    return (
        <div className="space-y-6 rounded-xl border border-[#1E293B] bg-[#080F20] p-6 sm:p-8">
            <div className="h-7 w-2/3 rounded bg-[#111B30]" />
            <div className="flex items-center justify-between border-y border-[#1E293B] py-4">
                <div className="h-8 w-44 rounded bg-[#111B30]" />
                <div className="flex gap-2">
                    <div className="h-8 w-24 rounded-lg bg-[#111B30]" />
                    <div className="h-8 w-24 rounded-lg bg-[#111B30]" />
                    <div className="h-8 w-32 rounded-lg bg-[#111B30]" />
                </div>
            </div>
            <div className="space-y-3">
                <div className="h-4 w-full rounded bg-[#111B30]" />
                <div className="h-4 w-5/6 rounded bg-[#111B30]" />
                <div className="h-32 w-full rounded-xl bg-[#111B30]" />
            </div>
        </div>
    );
}

async function QuestionContent({ params, searchParams }: RouteParams) {
    const { id } = await params;
    const resolvedSearchParams = await searchParams;
    const filter =
        typeof resolvedSearchParams?.filter === "string" &&
        resolvedSearchParams.filter.trim() !== ""
            ? resolvedSearchParams.filter
            : "latest";

    const { success, data } = await getQuestion({ id });

    if (!success || !data) {
        redirect("/404");
    }

    after(async () => {
        await incrementViews({ questionId: id });
    });

    const {
        success: answerSuccess,
        data: answersData,
        error: answerError,
    } = await getQuestionsAllAnswers({
        questionId: id,
        page: 1,
        pageSize: 10,
        filter,
    });

    const hasVotedPromise = hasVoted({ targetId: id, targetType: "question" });

    const question = data;
    const authorInitial = question.author?.name?.[0]?.toUpperCase() ?? "?";
    const answers = answersData?.answers ?? [];
    const totalAnswers = answersData?.totalAnswers ?? answers.length;

    return (
        <article className="rounded-xl border border-[#1E293B] bg-[#080F20] p-6 sm:p-8">
            {/* Top Metadata & Stats */}
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-[#94A3B8]">
                <div className="flex flex-wrap items-center gap-3">
                    <span>
                        Asked <MetricTimestamp createdAt={question.createdAt} />
                    </span>
                    {question.updatedAt &&
                        question.updatedAt !== question.createdAt && (
                            <>
                                <span className="text-[#475569]">•</span>
                                <span>
                                    Updated{" "}
                                    <MetricTimestamp
                                        createdAt={question.updatedAt}
                                    />
                                </span>
                            </>
                        )}
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <span>
                        <strong className="font-semibold text-[#F1F5F9]">
                            {question.views ?? 0}
                        </strong>{" "}
                        Views
                    </span>
                    <span>
                        <strong className="font-semibold text-[#F1F5F9]">
                            {question.answers ?? totalAnswers}
                        </strong>{" "}
                        Answers
                    </span>
                </div>
            </div>

            {/* Title */}
            <h1 className="mt-3 text-xl font-bold leading-snug text-[#F1F5F9] sm:text-2xl">
                {question.title}
            </h1>

            {/* Author Details + Upvote / Downvote / Collection Actions */}
            <div className="mt-5 flex flex-col justify-between gap-4 border-y border-[#1E293B] py-4 md:flex-row md:items-center">
                <Link
                    href={ROUTES.PROFILE(question.author._id.toString())}
                    className="inline-flex items-center gap-3 text-sm"
                >
                    {question.author?.image ? (
                        <Image
                            src={question.author.image}
                            alt={question.author.name}
                            width={34}
                            height={34}
                            className="size-8 rounded-full object-cover"
                        />
                    ) : (
                        <div className="flex size-8 items-center justify-center rounded-full bg-[#111B30] text-xs font-semibold text-[#FF8A00] ring-1 ring-[#1E293B]">
                            {authorInitial}
                        </div>
                    )}

                    <div>
                        <p className="font-semibold text-[#F1F5F9] transition-colors hover:text-[#FF8A00]">
                            {question.author?.name}
                        </p>
                        <p className="text-xs text-[#94A3B8]">Author</p>
                    </div>
                </Link>

                <Suspense fallback={<div>Loading...</div>}>
                    <QuestionActions
                        targetType={"question"}
                        hasVotedPromise={hasVotedPromise}
                        questionId={question._id.toString()}
                        initialUpvotes={question.upvotes ?? 0}
                        initialDownvotes={question.downvotes ?? 0}
                    />
                </Suspense>
            </div>

            {/* Body Content (Markdown + Syntax-Highlighted Code Blocks) */}
            <div className="mt-6">
                <MarkdownContent content={question.content} />
            </div>

            {/* Tags */}
            {question.tags && question.tags.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-2 border-t border-[#1E293B] pt-5">
                    {question.tags.map(
                        (tag: {
                            _id: string | { toString(): string };
                            name: string;
                        }) => (
                            <TagCard
                                key={tag._id.toString()}
                                _id={tag._id.toString()}
                                tagName={tag.name}
                                compact
                            />
                        ),
                    )}
                </div>
            )}

            {/* Answers List & Filter (Appears Before Answer Form) */}
            <AnswersSection
                answers={answers}
                totalAnswers={totalAnswers}
                currentFilter={filter}
                hasError={!answerSuccess}
                errorMessage={answerError?.message}
            />

            {/* Answer Submission Form */}
            <section className="mt-8 border-t border-[#1E293B] pt-8">
                <AnswerForm questionId={id} />
            </section>
        </article>
    );
}

const QuestionDetails = ({ params, searchParams }: RouteParams) => {
    return (
        <section className="mx-auto w-full max-w-5xl px-4 py-2 sm:px-2">
            <Suspense fallback={<QuestionDetailsFallback />}>
                <QuestionContent params={params} searchParams={searchParams} />
            </Suspense>
        </section>
    );
};

export default QuestionDetails;

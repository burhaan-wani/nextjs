import Filter from "@/components/search/Filter";
import SearchBar from "@/components/search/SearchBar";
import ROUTES from "@/constants/routes";
import { Button } from "@base-ui/react";
import Link from "next/link";
import QuestionCard from "@/components/cards/QuestionCard";
import { getQuestions } from "@/lib/actions/question.action";
import { Suspense } from "react";
import { RouteParams } from "@/types/global";

export const instant = false;

interface HomeProps {
    searchParams: Promise<{ [key: string]: string }>;
}

async function QuestionList({ searchParams }: HomeProps) {
    const { query = "", filter = "", page, pageSize } = await searchParams;

    const result = await getQuestions({
        query: query || "",
        filter: filter || "",
        page: Number(page) || 1,
        pageSize: Number(pageSize) || 10,
    });
    const { questions } = result.data || {};
    if (!result.success || !result.data) {
        return <p>Could not load questions.</p>;
    }

    // Render cards...
    return questions && questions.length > 0 ? (
        questions.map((question) => (
            <QuestionCard key={question._id.toString()} question={question} />
        ))
    ) : (
        <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg font-medium">No questions found</p>
            <p className="text-sm mt-1">
                Try searching for something else or ask a new question.
            </p>
        </div>
    );
}

export default function Home({ searchParams }: RouteParams) {
    return (
        <section className="">
            <div className="flex justify-between items-center">
                <h1 className="font-bold text-2xl">All Questions</h1>
                <Button className="bg-linear-to-r from-orange-500 to-amber-500 px-4 py-2.5 rounded-md font-medium text-white shadow-sm hover:opacity-95 transition-opacity">
                    <Link href={ROUTES.ASK_QUESTION}>Ask a question</Link>
                </Button>
            </div>

            <div className="mt-6">
                <SearchBar
                    route="/"
                    className="w-full"
                    placeHolder="Search Questions..."
                />
            </div>

            <div className="mt-4">
                <Filter />
            </div>

            <div className="mt-8 flex flex-col gap-4">
                <Suspense
                    fallback={
                        <div className="h-16 w-full border-b border-slate-800/80 bg-slate-950/80" />
                    }
                >
                    <QuestionList searchParams={searchParams} />
                </Suspense>
            </div>
        </section>
    );
}

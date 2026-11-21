import Filter from "@/components/search/Filter";
import SearchBar from "@/components/search/SearchBar";
import ROUTES from "@/constants/routes";
import { Button } from "@base-ui/react";
import Link from "next/link";
import QuestionCard from "@/components/cards/QuestionCard";
import { DUMMY_QUESTIONS } from "@/constants";
import { auth } from "@/auth";

export const instant = false;

interface HomeProps {
    searchParams: Promise<{ [key: string]: string }>;
}

const Home = async ({ searchParams }: HomeProps) => {
    const { query = "", filter = "" } = await searchParams;

    const filteredQuestions = DUMMY_QUESTIONS.filter((q) =>
        q.title.toLowerCase().includes(query.toLowerCase()),
    );
    const session = await auth();

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
                {filteredQuestions.length > 0 ? (
                    filteredQuestions.map((question) => (
                        <QuestionCard key={question._id} question={question} />
                    ))
                ) : (
                    <div className="text-center py-12 text-muted-foreground">
                        <p className="text-lg font-medium">
                            No questions found
                        </p>
                        <p className="text-sm mt-1">
                            Try searching for something else or ask a new
                            question.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Home;

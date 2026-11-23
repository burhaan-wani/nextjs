import { Suspense } from "react";
import { RouteParams } from "@/types/global";

async function QuestionContent({ params }: { params: RouteParams["params"] }) {
    const { id } = await params;

    return <div>QuestionDetails {id}</div>;
}

const QuestionDetails = ({ params }: RouteParams) => {
    return (
        <section>
            <h1>Question Details</h1>
            <Suspense fallback={<div>Loading question...</div>}>
                <QuestionContent params={params} />
            </Suspense>
        </section>
    );
};

export default QuestionDetails;

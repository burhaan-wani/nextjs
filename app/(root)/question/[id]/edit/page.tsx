import { auth } from "@/auth";
import AskQuestion from "@/components/form/AskQuestion";
import ROUTES from "@/constants/routes";
import { getQuestion } from "@/lib/actions/question.action";
import { RouteParams } from "@/types/global";
import mongoose from "mongoose";
import { notFound, redirect } from "next/navigation";

export const instant = false;

const AskAQuestion = async ({ params }: RouteParams) => {
    const { id } = await params;
    if (!id) return notFound();

    const { data: question, success } = await getQuestion(
        new mongoose.Types.ObjectId(id),
    );

    const session = await auth();
    const userId = session?.user?.id;
    if (!session) return redirect(ROUTES.HOME);

    if (question?.author.toString() !== userId)
        return redirect(`/question/${id}`);

    return (
        <section className="space-y-7">
            <h1 className="font-bold text-2xl">Edit a question</h1>
            <AskQuestion question={question} isEdit />
        </section>
    );
};

export default AskAQuestion;

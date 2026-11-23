import { auth } from "@/auth";
import AskQuestion from "@/components/form/AskQuestion";
import ROUTES from "@/constants/routes";
import { redirect } from "next/navigation";

export const instant = false;

const AskAQuestion = async () => {
    const session = await auth();
    if (!session) return redirect(ROUTES.SIGN_IN);

    return (
        <section className="space-y-7">
            <h1 className="font-bold text-2xl">Ask a question</h1>
            <AskQuestion />
        </section>
    );
};

export default AskAQuestion;

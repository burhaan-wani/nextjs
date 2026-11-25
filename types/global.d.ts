import { Types } from "mongoose";
import { NextResponse } from "next/server";

interface RouteParams {
    params: Promise<Record<string, string>>;
    searchParams: Promise<Record<string, string>>;
}
interface Author {
    _id: string;
    name: string;
    image: string;
}

interface Tag {
    _id: Types.ObjectId;
    name: string;
    questions: number;
}

type TQuestion = {
    _id: Types.ObjectId;
    title: string;
    content: string;
    tags: Tag[];
    author: Author;
    createdAt: Date;
    upvotes: number;
    downvotes: number;
    answers: number;
    views: number;
    updatedAt: Date;
};

type ActionResponse<T = null> = {
    success: boolean;
    data?: T;
    error?: {
        message: string;
        details: Record<string, string[]>;
    };
    status?: number;
};

type SuccessResponse<T = null> = ActionResponse<T> & { success: true };
type ErrorResponse = ActionResponse<undefined> & { success: false };

type APIErrorResponse = NextResponse<ErrorResponse>;
type APIResponse<T = null> = NextResponse<SuccessResponse<T> | ErrorResponse>;

interface SignInWithOAuthParams {
    provider: "github" | "google";
    providerAccountId: string;
    user: {
        name: string;
        username: string;
        image: string;
        email: string;
    };
}

type AuthCredentials = {
    name: string;
    username: string;
    email: string;
    password: string;
};

type CreateQuestion = {
    title: string;
    content: string;
    tags: string[];
};

interface EditQuestion extends CreateQuestion {
    questionId: string;
}

interface PaginatedSearchParams {
    page?: number;
    pageSize?: number;
    query?: string;
    filter?: string;
    sort?: string;
}

interface TagQuestionParams extends Omit<PaginatedSearchParams, "filter"> {
    tagId: string;
}

interface IncrementViewsProps {
    questionId: string;
}

interface AnswerQuestionProps {
    questionId: string;
    content: string;
}

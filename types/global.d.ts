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
    _id: string;
    name: string;
}

export interface Question {
    _id: string;
    title: string;
    description: string;
    author: Author;
    tags: Tag[];
    upvotes: number;
    answers: number;
    views: number;
    createdAt: Date;
}

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

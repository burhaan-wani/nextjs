import { Question } from "@/types/global";

export const navLinks = [
    {
        label: "Home",
        route: "/",
    },
    {
        label: "Collections",
        route: "/collections",
    },
    {
        label: "Community",
        route: "/community",
    },
    {
        label: "Tags",
        route: "/tags",
    },
    {
        label: "Profile",
        route: "/profile",
    },
    {
        label: "Ask Question",
        route: "/ask-question",
    },
];

export const DUMMY_QUESTIONS: Question[] = [
    {
        _id: "1",
        title: "How to handle asynchronous state updates in React Server Components?",
        description:
            "I am trying to fetch data inside an RSC and pass it down, but I keep running into serialization issues with dates and functions. What is the best pattern to handle this?",
        author: {
            _id: "u1",
            name: "Alex Rivera",
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
        },
        tags: [
            { _id: "t1", name: "react" },
            { _id: "t2", name: "nextjs" },
        ],
        createdAt: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        views: 142,
        answers: 3,
        upvotes: 12,
    },
    {
        _id: "2",
        title: "What is the difference between Tailwind CSS v4 and v3 configuration?",
        description:
            "Tailwind v4 introduces CSS-first configuration using `@theme` inside CSS files instead of `tailwind.config.js`. How do custom color extensions work now?",
        author: {
            _id: "u2",
            name: "Sarah Chen",
            image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=faces",
        },
        tags: [
            { _id: "t3", name: "tailwind-css" },
            { _id: "t4", name: "css" },
        ],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
        views: 520,
        answers: 8,
        upvotes: 34,
    },
    {
        _id: "3",
        title: "Optimizing MongoDB aggregation pipelines for high-volume logs",
        description:
            "Looking for strategies to speed up a complex `$facet` and `$lookup` pipeline that runs across millions of documents.",
        author: {
            _id: "u3",
            name: "Marcus Brody",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
        },
        tags: [
            { _id: "t5", name: "mongodb" },
            { _id: "t6", name: "database" },
        ],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
        views: 1205,
        answers: 5,
        upvotes: 45,
    },
];

export const TopQuestions = [
    {
        _id: "1",
        title: "How to optimize re-renders in large React applications?",
    },
    {
        _id: "2",
        title: "What is the difference between Server and Client Components in Next.js?",
    },
    {
        _id: "3",
        title: "How to handle asynchronous operations cleanly in JavaScript?",
    },
    {
        _id: "4",
        title: "Best practices for structural project organization in Python?",
    },
    {
        _id: "5",
        title: "How does Go handle concurrency with goroutines and channels?",
    },
];

export const TopTags = [
    { _id: "t1", tagName: "react", totalQuestions: 1240 },
    { _id: "t2", tagName: "nextjs", totalQuestions: 850 },
    {
        _id: "t3",
        tagName: "javascript",
        totalQuestions: 3100,
    },
    { _id: "t4", tagName: "python", totalQuestions: 2150 },
    { _id: "t5", tagName: "golang", totalQuestions: 430 },
];

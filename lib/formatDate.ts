// lib/formatDate.ts
export function getTimestamp(date: Date | string): string {
    const now = new Date();
    const targetDate = new Date(date);
    const seconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return `${Math.floor(interval)} years ago`;

    interval = seconds / 2592000;
    if (interval > 1) return `${Math.floor(interval)} months ago`;

    interval = seconds / 86400;
    if (interval > 1) return `${Math.floor(interval)} days ago`;

    interval = seconds / 3600;
    if (interval > 1) return `${Math.floor(interval)} hours ago`;

    interval = seconds / 60;
    if (interval > 1) return `${Math.floor(interval)} mins ago`;

    if (seconds < 10) return "just now";

    return `${Math.floor(seconds)} seconds ago`;
}

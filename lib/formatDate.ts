const formatUnit = (value: number, singular: string) =>
    `${value} ${singular}${value === 1 ? "" : "s"} ago`;

export function getTimestamp(date: Date | string): string {
    const targetDate = date instanceof Date ? date : new Date(date);

    if (Number.isNaN(targetDate.getTime())) {
        return "";
    }

    const now = new Date();
    const seconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);

    if (seconds < 10) {
        return "just now";
    }

    const years = Math.floor(seconds / 31_536_000);
    if (years >= 1) return formatUnit(years, "year");

    const months = Math.floor(seconds / 2_592_000);
    if (months >= 1) return formatUnit(months, "month");

    const days = Math.floor(seconds / 86_400);
    if (days >= 1) return formatUnit(days, "day");

    const hours = Math.floor(seconds / 3_600);
    if (hours >= 1) return formatUnit(hours, "hour");

    const minutes = Math.floor(seconds / 60);
    if (minutes >= 1) return `${minutes} ${minutes === 1 ? "min" : "mins"} ago`;

    return `${seconds} ${seconds === 1 ? "second" : "seconds"} ago`;
}

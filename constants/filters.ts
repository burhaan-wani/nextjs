export interface FilterOption {
    name: string;
    value: string;
}

export const HOME_FILTERS: FilterOption[] = [
    { name: "Newest", value: "newest" },
    { name: "Recommended", value: "recommended" },
    { name: "Frequent", value: "frequent" },
    { name: "Unanswered", value: "unanswered" },
];

export const COMMUNITY_FILTERS: FilterOption[] = [
    { name: "Latest", value: "latest" },
    { name: "Oldest", value: "oldest" },
    { name: "Popular", value: "popular" },
];

export const TAG_FILTERS: FilterOption[] = [
    { name: "Popular", value: "popular" },
    { name: "Recent", value: "recent" },
    { name: "Name", value: "name" },
    { name: "Oldest", value: "oldest" },
];

export const COLLECTION_FILTERS: FilterOption[] = [
    { name: "Recently Saved", value: "recentlysaved" },
    { name: "Most Recent", value: "mostrecent" },
    { name: "Oldest", value: "oldest" },
    { name: "Most Voted", value: "mostvoted" },
    { name: "Most Answered", value: "mostanswered" },
    { name: "Most Viewed", value: "mostviewed" },
];

export const ANSWER_FILTERS: FilterOption[] = [
    { name: "Latest", value: "latest" },
    { name: "Oldest", value: "oldest" },
    { name: "Popular", value: "popular" },
];

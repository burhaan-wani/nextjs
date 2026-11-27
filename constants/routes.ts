const ROUTES = {
    HOME: "/",
    SIGN_IN: "/sign-in",
    SIGN_UP: "sign-up",
    ASK_QUESTION: "/ask-question",
    PROFILE: (_id: string) => `/profile/${_id}`,
    QUESTION: (_id: string) => `/question/${_id}`,
    TAG: (_id: string) => `/tags/${_id}`,
    TAGS: "/tags",
    QUESTION_DETAILS: (_id: string) => `/question/${_id}`,
    COMMUNITY: "/community",
    COLLECTION: "/collections",
    PROFILE_EDIT: (id: string) => `/profile/${id}/edit`,
} as const;

export default ROUTES;

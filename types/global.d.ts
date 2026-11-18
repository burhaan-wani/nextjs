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

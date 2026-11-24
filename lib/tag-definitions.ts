const TAG_DEFINITIONS: Record<string, string> = {
    javascript:
        "High-level, event-driven scripting language powering interactive web apps, runtimes like Node.js, and full-stack tooling.",
    typescript:
        "Strongly typed superset of JavaScript that compiles to plain JavaScript for safer large-scale codebases and better editor tooling.",
    react: "Component-based UI library for building declarative, stateful user interfaces across web and native platforms.",
    nextjs: "Full-stack React framework offering App Router, server rendering, caching, and server actions for production web apps.",
    "next.js":
        "Full-stack React framework offering App Router, server rendering, caching, and server actions for production web apps.",
    nodejs: "JavaScript runtime built on V8 for creating fast, non-blocking servers, APIs, and backend services.",
    "node.js":
        "JavaScript runtime built on V8 for creating fast, non-blocking servers, APIs, and backend services.",
    python: "Versatile, readable programming language widely used in backend development, automation, scripting, data science, and AI.",
    mongodb:
        "Document-oriented NoSQL database storing flexible JSON-like BSON documents with rich querying and aggregation.",
    mongoose:
        "Object Data Modeling (ODM) library for MongoDB and Node.js providing schemas, validation, hooks, and population.",
    sql: "Structured query language for defining, querying, and manipulating relational database tables and transactions.",
    postgresql:
        "Advanced open-source relational database known for ACID compliance, complex queries, JSONB support, and reliability.",
    html: "Foundational markup language that defines the structure and semantic meaning of web documents.",
    css: "Stylesheet language controlling layout, typography, colors, spacing, and responsive behavior in web interfaces.",
    tailwindcss:
        "Utility-first CSS framework for composing custom designs directly in markup using low-level design tokens.",
    git: "Distributed version control system for tracking code changes, branching workflows, and collaborative history.",
    docker: "Containerization platform that packages applications and their dependencies into portable runtime environments.",
    api: "Contract and interface layer allowing software components or services to communicate over defined endpoints.",
    rest: "Architectural style for networked APIs using standard HTTP methods, stateless requests, and resource URLs.",
    graphql:
        "Query language and runtime for APIs letting clients request exact data shapes across connected resources.",
};

export function getTagDefinition(tagName: string): string {
    const normalized = tagName.trim().toLowerCase();

    if (TAG_DEFINITIONS[normalized]) {
        return TAG_DEFINITIONS[normalized];
    }

    // Check substring/keyword matches for compound tags (e.g., "react-query" or "nextjs-16")
    if (normalized.includes("typescript") || normalized === "ts") {
        return TAG_DEFINITIONS.typescript;
    }
    if (normalized.includes("javascript") || normalized === "js") {
        return TAG_DEFINITIONS.javascript;
    }
    if (normalized.includes("react")) {
        return TAG_DEFINITIONS.react;
    }
    if (normalized.includes("next")) {
        return TAG_DEFINITIONS.nextjs;
    }
    if (normalized.includes("mongo")) {
        return TAG_DEFINITIONS.mongodb;
    }
    if (normalized.includes("sql") || normalized.includes("postgres")) {
        return TAG_DEFINITIONS.postgresql;
    }

    const formatted = tagName.trim() || "This";
    return `${formatted} is a technical topic tag in DevFlow used to organize questions, patterns, and discussions around ${formatted.toLowerCase()}.`;
}

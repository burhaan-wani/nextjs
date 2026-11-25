"use client";

import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

interface MarkdownContentProps {
    content: string;
}

function decodeHtmlEntities(str: string): string {
    return str
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&amp;/g, "&");
}

function prepareContent(raw: string): string {
    return raw.replace(
        /<pre[^>]*>\s*<code[^>]*>([\s\S]*?)<\/code>\s*<\/pre>/gi,
        (_, codeInner: string) => {
            const decodedCode = decodeHtmlEntities(codeInner).trim();
            const looksLikeTsxOrJsx =
                /import\s+.*from|export\s+default|className=|return\s*\(/.test(
                    decodedCode,
                );
            const lang = looksLikeTsxOrJsx ? "tsx" : "";
            return `\n\n\`\`\`${lang}\n${decodedCode}\n\`\`\`\n\n`;
        },
    );
}

const MarkdownContent = ({ content }: MarkdownContentProps) => {
    const formattedContent = prepareContent(content);

    return (
        <div className="max-w-none text-[15px] leading-7 text-[#CBD5E1] [&_a]:text-[#FF8A00] [&_a]:underline [&_blockquote]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:border-[#334155] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-[#94A3B8] [&_code]:font-mono [&_h1]:mb-3 [&_h1]:mt-6 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-[#F1F5F9] [&_h2]:mb-3 [&_h2]:mt-5 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-[#F1F5F9] [&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-[#F1F5F9] [&_li]:my-1 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-6 [&_p]:my-3 [&_p:empty]:hidden [&_p]:wrap-break-word [&_pre]:my-5 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-[#1E293B] [&_pre]:bg-[#050A14] [&_pre]:p-4 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-[13px] [&_pre_code]:leading-6 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6 [&_p_code]:rounded-md [&_p_code]:border [&_p_code]:border-[#1E293B] [&_p_code]:bg-[#111B30] [&_p_code]:px-1.5 [&_p_code]:py-0.5 [&_p_code]:text-[13px] [&_p_code]:font-medium [&_p_code]:text-[#FF8A00] [&_li_code]:rounded-md [&_li_code]:border [&_li_code]:border-[#1E293B] [&_li_code]:bg-[#111B30] [&_li_code]:px-1.5 [&_li_code]:py-0.5 [&_li_code]:text-[13px] [&_li_code]:font-medium [&_li_code]:text-[#FF8A00]">
            <ReactMarkdown rehypePlugins={[rehypeRaw, rehypeHighlight]}>
                {formattedContent}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownContent;

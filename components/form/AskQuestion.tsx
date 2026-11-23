"use client";

import { useState, type KeyboardEvent } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { z } from "zod";

import { askAQuestionSchema } from "@/lib/validations";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { SimpleEditor } from "../tiptap-templates/simple/simple-editor";
import { createQuestion } from "@/lib/actions/question.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ROUTES from "@/constants/routes";

const MAX_TAGS = 5;
interface AskQuestionData {
    title: string;
    content: string;
    tags: string[];
}

const AskQuestion = () => {
    const router = useRouter();
    const [tagInput, setTagInput] = useState("");

    const form = useForm({
        resolver: zodResolver(askAQuestionSchema),
        defaultValues: {
            title: "",
            content: "",
            tags: [],
        },
    });

    const {
        control,
        handleSubmit,
        setValue,
        getValues,
        formState: { isSubmitting },
    } = form;

    // Add a tag to the form
    const addTag = () => {
        const newTag = tagInput.trim().toLowerCase();
        const currentTags = getValues("tags");

        if (!newTag) return;

        if (currentTags.includes(newTag)) {
            setTagInput("");
            return;
        }

        if (currentTags.length >= MAX_TAGS) {
            form.setError("tags", { message: "Can't add more than 5 tags" });
            setTagInput("");
            return;
        }

        setValue("tags", [...currentTags, newTag], {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
        });

        setTagInput("");
    };

    // Handle tag input keyboard events
    const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addTag();
        }
    };

    // Remove a tag
    const removeTag = (tagToRemove: string) => {
        const updatedTags = getValues("tags").filter(
            (tag) => tag !== tagToRemove,
        );

        setValue("tags", updatedTags, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
        });
    };

    // Form submission
    const handleFormSubmit = async (
        data: z.infer<typeof askAQuestionSchema>,
    ) => {
        const result = await createQuestion(data as AskQuestionData);
        if (result.success) {
            toast.success("Question created successfully");
            if (result.data)
                router.push(
                    ROUTES.QUESTION_DETAILS(result.data._id.toString()),
                );
        } else {
            toast.error(result.error?.message);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="w-full space-y-5 "
        >
            <FieldGroup className="gap-7">
                {/* Question Title */}
                <Controller
                    name="title"
                    control={control}
                    render={({ field, fieldState }) => {
                        const inputId = "question-title";

                        return (
                            <Field
                                data-invalid={fieldState.invalid}
                                className="space-y-1"
                            >
                                <FieldLabel
                                    htmlFor={inputId}
                                    className="text-sm font-semibold text-[#F1F5F9]"
                                >
                                    Question Title
                                    <span className="text-[#FF8A00]">*</span>
                                </FieldLabel>

                                <Input
                                    {...field}
                                    id={inputId}
                                    type="text"
                                    autoComplete="off"
                                    maxLength={150}
                                    aria-invalid={fieldState.invalid}
                                    placeholder="e.g. How does React Server Components work?"
                                    className="h-9 rounded-lg border border-[#1E293B] bg-[#080F20] px-4 text-sm text-[#F1F5F9] placeholder:text-[#64748B] transition-all focus-visible:border-[#FF8A00] focus-visible:ring-1 focus-visible:ring-[#FF8A00]/30"
                                />

                                <p className="text-xs leading-relaxed text-[#94A3B8]">
                                    Be specific and imagine you're asking a
                                    question to another person.
                                </p>

                                {fieldState.invalid && (
                                    <FieldError
                                        errors={[fieldState.error]}
                                        className="text-xs text-red-400"
                                    />
                                )}
                            </Field>
                        );
                    }}
                />

                {/* Question Description */}
                <Controller
                    name="content"
                    control={control}
                    render={({ field, fieldState }) => {
                        const inputId = "question-description";

                        return (
                            <Field
                                data-invalid={fieldState.invalid}
                                className="space-y-1"
                            >
                                <FieldLabel
                                    htmlFor={inputId}
                                    className="text-sm font-semibold text-[#F1F5F9]"
                                >
                                    Detailed explanation of your problem
                                    <span className="text-[#FF8A00]">*</span>
                                </FieldLabel>

                                <p className="text-xs leading-relaxed text-[#94A3B8]">
                                    Introduce the problem and expand on what
                                    you've put in the title.
                                </p>

                                <SimpleEditor
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                                {/* </div> */}
                                {fieldState.invalid && (
                                    <FieldError
                                        errors={[fieldState.error]}
                                        className="text-xs text-red-400"
                                    />
                                )}
                            </Field>
                        );
                    }}
                />

                {/* Tags */}
                <Controller
                    name="tags"
                    control={control}
                    render={({ field, fieldState }) => {
                        const inputId = "question-tags";

                        return (
                            <Field
                                data-invalid={fieldState.invalid}
                                className="space-y-1"
                            >
                                <FieldLabel
                                    htmlFor={inputId}
                                    className="text-sm font-semibold text-[#F1F5F9]"
                                >
                                    Tags
                                    <span className="text-[#FF8A00]">*</span>
                                </FieldLabel>

                                {/* Tag Input */}

                                {/* Tag Input */}
                                <div className="space-y-3">
                                    {/* Input */}
                                    <div className="rounded-lg border border-[#1E293B] bg-[#080F20] transition-all focus-within:border-[#FF8A00] focus-within:ring-1 focus-within:ring-[#FF8A00]/30">
                                        <Input
                                            id={inputId}
                                            type="text"
                                            value={tagInput}
                                            onChange={(e) =>
                                                setTagInput(e.target.value)
                                            }
                                            onKeyDown={handleTagKeyDown}
                                            autoComplete="off"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Add tags and press Enter..."
                                            className="h-9 border-0 bg-transparent px-4 text-sm text-[#F1F5F9] shadow-none placeholder:text-[#64748B] focus-visible:ring-0"
                                        />
                                    </div>

                                    {/* Selected Tags - Appear Below Input */}
                                    {field.value.length > 0 && (
                                        <div className="flex flex-wrap items-center gap-2">
                                            {field.value.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="inline-flex items-center gap-2 rounded-md border border-[#1E293B] bg-[#111B30] px-3 py-1.5 text-xs font-semibold text-[#E2E8F0]"
                                                >
                                                    {tag}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeTag(tag)
                                                        }
                                                        aria-label={`Remove ${tag} tag`}
                                                        className="text-[#94A3B8] transition-colors hover:text-[#FF8A00]"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Helper Text and Tag Counter */}
                                <div className="flex items-center justify-between gap-3">
                                    <p className="text-xs leading-relaxed text-[#94A3B8]">
                                        Add up to 5 tags to describe what your
                                        question is about. Press Enter to add a
                                        tag.
                                    </p>

                                    <span className="shrink-0 text-xs text-[#64748B]">
                                        {field.value.length}/{MAX_TAGS}
                                    </span>
                                </div>

                                {fieldState.invalid && (
                                    <FieldError
                                        errors={[fieldState.error]}
                                        className="text-xs text-red-400"
                                    />
                                )}
                            </Field>
                        );
                    }}
                />
            </FieldGroup>

            {/* Submit Button */}
            <div className="flex justify-end border-t border-[#1E293B] pt-6">
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-11 rounded-lg bg-[#FF8A00] px-6 font-semibold text-white transition-colors hover:bg-[#F07800] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSubmitting ? "Submitting..." : "Ask a Question"}
                </Button>
            </div>
        </form>
    );
};

export default AskQuestion;

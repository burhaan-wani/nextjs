"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { z } from "zod";

import { answerQuestionSchema } from "@/lib/validations";

import { Button } from "../ui/button";
import { SimpleEditor } from "../tiptap-templates/simple/simple-editor";
import { answerAQuestion } from "@/lib/actions/question.action";
import { toast } from "sonner";

interface AnswerQuestionProps {
    questionId: string;
}
const AnswerForm = ({ questionId }: AnswerQuestionProps) => {
    const form = useForm({
        resolver: zodResolver(answerQuestionSchema),
        defaultValues: {
            content: "",
        },
    });

    const {
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = form;

    const handleFormSubmit = async (
        data: z.infer<typeof answerQuestionSchema>,
    ) => {
        const result = await answerAQuestion({
            ...(data as { content: string }),
            questionId,
        });
        if (result.success) {
            reset({ content: "" });
            toast.success("Answer submitted successfully");
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
                                    Write your answer here
                                    <span className="text-[#FF8A00]">*</span>
                                </FieldLabel>

                                <SimpleEditor
                                    value={field.value}
                                    onChange={field.onChange}
                                />
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

            <div className="flex justify-end border-t border-[#1E293B] pt-6">
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-11 rounded-lg bg-[#FF8A00] px-6 font-semibold text-white transition-colors hover:bg-[#F07800] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSubmitting ? "Posting..." : "Answer"}
                </Button>
            </div>
        </form>
    );
};

export default AnswerForm;

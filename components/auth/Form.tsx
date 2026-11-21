"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
    Controller,
    DefaultValues,
    FieldValues,
    Path,
    SubmitHandler,
    useForm,
} from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { ZodType } from "zod/v3";
import Link from "next/link";
import ROUTES from "@/constants/routes";
import { ActionResponse } from "@/types/global";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type AuthFormProps<T extends FieldValues> = {
    formType: "SIGN_IN" | "SIGN_UP";
    schema: ZodType<T>;
    defaultValues: T;
    onSubmit: (data: T) => Promise<ActionResponse>;
};

const AuthForm = <T extends FieldValues>({
    formType,
    schema,
    defaultValues,
    onSubmit,
}: AuthFormProps<T>) => {
    const router = useRouter();
    const authForm = useForm<T>({
        resolver: zodResolver(schema),
        defaultValues: defaultValues as DefaultValues<T>,
    });

    const handleSubmit: SubmitHandler<T> = async (data) => {
        const result = (await onSubmit(data)) as ActionResponse;
        if (result.success) {
            toast(
                formType === "SIGN_UP"
                    ? "Signed up successfully"
                    : "Signed in successfully",
            );
            router.push(ROUTES.HOME);
        } else {
            console.log(result.error);
            toast(result.error?.message);
        }
    };

    const buttonText = formType === "SIGN_IN" ? "Sign In" : "Sign Up";

    return (
        <div className="w-full">
            <form
                id="auth-form"
                onSubmit={authForm.handleSubmit(handleSubmit)}
                className="space-y-5"
            >
                <div className="flex flex-col gap-4">
                    {Object.keys(defaultValues).map((fieldKey) => (
                        <FieldGroup key={fieldKey}>
                            <Controller
                                name={fieldKey as Path<T>}
                                control={authForm.control}
                                render={({ field, fieldState }) => {
                                    const inputId = `form-field-${fieldKey}`;
                                    return (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                            className="space-y-1.5"
                                        >
                                            <FieldLabel
                                                htmlFor={inputId}
                                                className="text-xs font-medium uppercase tracking-wider text-slate-300"
                                            >
                                                {field.name
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    field.name.slice(1)}
                                            </FieldLabel>
                                            <Input
                                                type={
                                                    field.name
                                                        .toLowerCase()
                                                        .includes("password")
                                                        ? "password"
                                                        : "text"
                                                }
                                                {...field}
                                                id={inputId}
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                                autoComplete="off"
                                                className="w-full rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 shadow-inner transition-all focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                                                placeholder={`Enter your ${field.name}`}
                                            />
                                            {fieldState.invalid && (
                                                <FieldError
                                                    errors={[fieldState.error]}
                                                    className="text-xs text-red-400 mt-1"
                                                />
                                            )}
                                        </Field>
                                    );
                                }}
                            />
                        </FieldGroup>
                    ))}
                </div>

                <Button
                    type="submit"
                    disabled={authForm.formState.isSubmitting}
                    className="w-full rounded-lg bg-orange-600 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-orange-950/50 transition-all hover:bg-orange-500 active:scale-[0.98] disabled:opacity-50"
                >
                    {authForm.formState.isSubmitting
                        ? "Processing..."
                        : buttonText}
                </Button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-400">
                {formType === "SIGN_UP" ? (
                    <p>
                        Already have an account?{" "}
                        <Link
                            className="font-medium text-orange-500 transition-colors hover:text-orange-400 hover:underline"
                            href={ROUTES.SIGN_IN}
                        >
                            Sign In
                        </Link>
                    </p>
                ) : (
                    <p>
                        Don't have an account?{" "}
                        <Link
                            className="font-medium text-orange-500 transition-colors hover:text-orange-400 hover:underline"
                            href={ROUTES.SIGN_UP}
                        >
                            Sign Up
                        </Link>
                    </p>
                )}
            </div>
        </div>
    );
};

export default AuthForm;

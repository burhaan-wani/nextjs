"use client";

import AuthForm from "@/components/auth/Form";
import { loginSchema } from "@/lib/validations";

const SignIn = () => {
    return (
        <AuthForm
            formType={"SIGN_IN"}
            schema={loginSchema}
            defaultValues={{ email: "", password: "" }}
            onSubmit={(data) => Promise.resolve({ success: true })}
        />
    );
};

export default SignIn;

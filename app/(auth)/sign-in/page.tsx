"use client";

import AuthForm from "@/components/auth/Form";
import { signInWithCredentials } from "@/lib/actions/auth.action";
import { loginSchema } from "@/lib/validations";

const SignIn = () => {
    return (
        <AuthForm
            formType={"SIGN_IN"}
            schema={loginSchema}
            defaultValues={{ email: "", password: "" }}
            onSubmit={signInWithCredentials}
        />
    );
};

export default SignIn;

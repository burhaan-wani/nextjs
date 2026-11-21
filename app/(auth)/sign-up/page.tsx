"use client";

import AuthForm from "@/components/auth/Form";
import { signUpWithCredentials } from "@/lib/actions/auth.action";
import { registerSchema } from "@/lib/validations";

const SignUp = () => {
    return (
        <AuthForm
            formType="SIGN_UP"
            schema={registerSchema}
            defaultValues={{ name: "", username: "", email: "", password: "" }}
            onSubmit={signUpWithCredentials}
        />
    );
};

export default SignUp;

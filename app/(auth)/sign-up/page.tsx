"use client";

import AuthForm from "@/components/auth/Form";
import { registerSchema } from "@/lib/validations";

const SignUp = () => {
    return (
        <AuthForm
            formType="SIGN_UP"
            schema={registerSchema}
            defaultValues={{ name: "", userName: "", email: "", password: "" }}
            onSubmit={(data) => Promise.resolve({ success: true, data })}
        />
    );
};

export default SignUp;

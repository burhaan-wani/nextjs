import SocialAuthForm from "@/components/auth/SocialAuthForm";
import React from "react";

interface AuthLayoutProps {
    children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
    return (
        <main className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12 text-slate-100 font-sans antialiased selection:bg-orange-500 selection:text-white">
            {/* Background subtle ambient glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] rounded-full bg-orange-600/10 blur-[120px]" />
            </div>

            {/* Auth Card Container */}
            <div className="relative w-full max-w-110 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-8 shadow-2xl backdrop-blur-xl">
                {/* Header Information */}
                <div className="flex items-center justify-between gap-5 mb-8">
                    <div className="space-y-1.5">
                        <h1 className="text-2xl font-bold tracking-tight text-white">
                            Join <span className="text-orange-500">Dev</span>
                            flow
                        </h1>
                        <p className="text-sm text-slate-400">
                            Get all your questions answered & collaborate
                        </p>
                    </div>

                    {/* Minimalist Tech Icon Badge */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10 text-orange-400 shadow-inner">
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.75}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                        </svg>
                    </div>
                </div>

                {/* Form Content (AuthForm) */}
                <div className="space-y-6">{children}</div>

                {/* Social Login Divider */}
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-800" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-slate-900/80 px-2 text-slate-500 tracking-wider">
                            Or continue with
                        </span>
                    </div>
                </div>

                {/* Social Auth Buttons */}
                <SocialAuthForm />
            </div>
        </main>
    );
};

export default AuthLayout;

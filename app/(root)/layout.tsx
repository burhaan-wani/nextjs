import Header from "@/components/Header";
import LeftSideBar from "@/components/LeftSideBar";
import RightSideBar from "@/components/RightSideBar";
import React, { Suspense } from "react";

interface RootLayoutProps {
    children: React.ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
    return (
        <div className="h-screen overflow-hidden bg-slate-950 text-slate-100 font-sans antialiased selection:bg-orange-500 selection:text-white">
            {/* Top Header */}
            <Suspense
                fallback={
                    <div className="h-16 w-full border-b border-slate-800/80 bg-slate-950/80" />
                }
            >
                <Header />
            </Suspense>

            {/* Main Application Shell */}
            <div className="flex h-[calc(100vh-4rem)] pt-16">
                {/* Left Sidebar */}
                <Suspense
                    fallback={
                        <div className="h-16 w-full border-b border-slate-800/80 bg-slate-950/80" />
                    }
                >
                    <LeftSideBar />
                </Suspense>

                {/* Central Main Content Area */}
                <main className="min-w-0 flex-1 overflow-y-auto px-6 py-8 pb-20 md:px-10 min-h-screen">
                    <div className="mx-auto max-w-5xl">{children}</div>
                </main>

                {/* Right Sidebar */}
                <RightSideBar />
            </div>
        </div>
    );
};

export default RootLayout;

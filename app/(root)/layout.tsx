import Header from "@/components/Header";
import LeftSideBar from "@/components/LeftSideBar";
import RightSideBar from "@/components/RightSideBar";
import React from "react";

interface RootLayoutProps {
    children: React.ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-orange-500 selection:text-white">
            {/* Top Header */}
            <Header />

            {/* Main Application Shell */}
            <div className="flex pt-16">
                {/* Left Sidebar */}
                <LeftSideBar />
                {/* Central Main Content Area */}
                <main className="flex-1 bg-slate-950 px-6 py-8 md:px-10 min-h-[calc(100vh-4rem)]">
                    <div className="mx-auto max-w-5xl">{children}</div>
                </main>

                {/* Right Sidebar */}
                <RightSideBar />
            </div>
        </div>
    );
};

export default RootLayout;

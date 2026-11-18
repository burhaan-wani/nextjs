import Link from "next/link";

const Header = () => {
    return (
        <header className="fixed top-0 z-50 flex h-16 w-full items-center justify-between border-b border-slate-800/80 bg-slate-950/80 px-6 backdrop-blur-md">
            <div className="flex items-center gap-2">
                <Link href="/" className="text-xl font-bold tracking-tight">
                    <p className="group flex items-center gap-2 text-xl font-bold tracking-tight text-white">
                        {/* Optional: Minimalist Icon / Bracket */}
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-500 font-mono text-sm transition-colors group-hover:bg-orange-500/20">
                            &lt;/&gt;
                        </span>

                        <span>
                            <span className="text-orange-500 drop-shadow-[0_0_12px_rgba(249,115,22,0.4)]">
                                Dev
                            </span>
                            <span className="text-slate-100 font-semibold">
                                flow
                            </span>
                        </span>
                    </p>{" "}
                </Link>
            </div>
            {/* Search Bar Placeholder / Component */}
            <div className="hidden md:flex items-center w-full max-w-md px-4 py-1.5 rounded-lg border border-slate-800 bg-slate-900/50 text-slate-400 text-sm">
                Search globally...
            </div>

            <div className="flex items-center gap-4">
                {/* User Avatar Placeholder */}
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-sm font-medium text-slate-200">
                    A
                </div>
            </div>
        </header>
    );
};

export default Header;

import Link from "next/link";
import Image from "next/image";

import { auth } from "@/auth";
import ROUTES from "@/constants/routes";
import { getInitials } from "@/lib/utils";

const Header = async () => {
    const session = await auth();
    const user = session?.user;
    const initials = getInitials(user?.name);

    return (
        <header className="fixed top-0 z-50 flex h-16 w-full items-center justify-between border-b border-slate-800/80 bg-slate-950/80 px-6 backdrop-blur-md">
            <div className="flex items-center gap-2">
                <Link
                    href="/"
                    className="group flex items-center gap-2 text-xl font-bold tracking-tight text-white"
                >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-orange-500/20 bg-orange-500/10 font-mono text-sm text-orange-500 transition-colors group-hover:bg-orange-500/20">
                        &lt;/&gt;
                    </span>

                    <span>
                        <span className="text-orange-500 drop-shadow-[0_0_12px_rgba(249,115,22,0.4)]">
                            Dev
                        </span>
                        <span className="font-semibold text-slate-100">
                            flow
                        </span>
                    </span>
                </Link>
            </div>

            {/* Search Bar Placeholder / Component */}
            <div className="hidden w-full max-w-md items-center rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-1.5 text-sm text-slate-400 md:flex">
                Search globally...
            </div>

            <div className="flex items-center gap-4">
                {user ? (
                    <Link
                        href={user.id ? ROUTES.PROFILE(user.id) : "/"}
                        aria-label="User profile"
                        className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-slate-700 bg-slate-800 text-sm font-medium text-slate-200 transition hover:border-orange-500/50"
                    >
                        {user.image ? (
                            <Image
                                src={user.image}
                                width={36}
                                height={36}
                                alt={user.name ?? "User avatar"}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <span>{initials}</span>
                        )}
                    </Link>
                ) : (
                    <Link
                        href={ROUTES.SIGN_IN}
                        className="rounded-md bg-orange-500 px-3.5 py-1.5 text-sm font-medium text-white transition hover:bg-orange-600"
                    >
                        Sign In
                    </Link>
                )}
            </div>
        </header>
    );
};

export default Header;

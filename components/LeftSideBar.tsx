import NavLinks from "./NavLinks";
import Link from "next/link";

const LeftSideBar = () => {
    return (
        <aside className="sticky top-16 flex h-[calc(100vh-4rem)] w-67 flex-col justify-between border-r border-slate-800/80 bg-slate-900/30 p-4">
            <nav className="flex flex-col gap-1 overflow-y-auto">
                <NavLinks />
            </nav>

            {/* Authentication Actions */}
            <div className="flex flex-col gap-2.5 pt-4 border-t border-slate-800/80">
                <Link
                    href="/sign-in"
                    className="flex items-center justify-center rounded-md bg-linear-to-r from-orange-500 to-amber-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-orange-950/50 transition-all hover:bg-orange-500 active:scale-[0.98]"
                >
                    Log In
                </Link>
                <Link
                    href="/sign-up"
                    className="flex items-center justify-center rounded-md border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-300 transition-all hover:bg-slate-800 hover:text-white active:scale-[0.98]"
                >
                    Sign Up
                </Link>
            </div>
        </aside>
    );
};

export default LeftSideBar;

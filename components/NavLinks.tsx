"use client";

import { navLinks } from "@/constants";
import { cn } from "cn";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavLinks = () => {
    const pathname = usePathname();
    const userId = 1;

    return (
        <div className="flex flex-col gap-4">
            {navLinks.map((link) => {
                // Compute the correct route (appending userId for profile) without mutating the constant
                const route =
                    link.route === "/profile"
                        ? `/profile/${userId}`
                        : link.route;

                // Match exact route for home ("/") or sub-routes safely
                const activeLink =
                    link.route === "/"
                        ? pathname === "/"
                        : pathname === route ||
                          pathname.startsWith(`${route}/`);

                return (
                    <Link
                        key={link.label}
                        href={route}
                        className={cn(
                            // Base styling: clean, borderless, subtle text color
                            "flex items-center p-4 rounded-lg text-sm font-medium text-slate-400 transition-all duration-200 hover:bg-slate-800/60 hover:text-slate-200",
                            // Active styling: glowing orange gradient with white text & subtle shadow
                            activeLink &&
                                "bg-linear-to-r from-orange-500 to-amber-500 text-white font-semibold shadow-lg shadow-orange-500/20 hover:from-orange-500 hover:to-amber-500 hover:text-white",
                        )}
                    >
                        {link.label}
                    </Link>
                );
            })}
        </div>
    );
};

export default NavLinks;

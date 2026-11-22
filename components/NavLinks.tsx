"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    Users,
    Bookmark,
    Briefcase,
    Tag,
    User,
    HelpCircle,
    type LucideIcon,
} from "lucide-react";

import { navLinks } from "@/constants";
import { cn } from "cn";

interface Props {
    userId?: string;
}

// Map routes (or labels) to suitable icons
const ROUTE_ICONS: Record<string, LucideIcon> = {
    "/": Home,
    "/community": Users,
    "/collection": Bookmark,
    "/jobs": Briefcase,
    "/tags": Tag,
    "/profile": User,
    "/ask-question": HelpCircle,
};

const NavLinks = ({ userId }: Props) => {
    const pathname = usePathname();

    return (
        <nav aria-label="Sidebar navigation" className="flex flex-col gap-4">
            {navLinks.map((link) => {
                if (link.route === "/profile" && !userId) {
                    return null;
                }

                // Compute the correct route without mutating the constant
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

                const Icon = ROUTE_ICONS[link.route] ?? Home;

                return (
                    <Link
                        key={link.label}
                        href={route}
                        className={cn(
                            "flex items-center gap-3 rounded-lg p-4 text-sm font-medium text-slate-400 transition-all duration-200 hover:bg-slate-800/60 hover:text-slate-200",
                            activeLink &&
                                "bg-linear-to-r from-orange-500 to-amber-500 font-semibold text-white shadow-lg shadow-orange-500/20 hover:from-orange-500 hover:to-amber-500 hover:text-white",
                        )}
                    >
                        <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                        <span>{link.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
};

export default NavLinks;

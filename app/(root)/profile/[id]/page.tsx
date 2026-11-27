import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
    Award,
    Calendar,
    ExternalLink,
    HelpCircle,
    MapPin,
    MessageSquare,
    Pencil,
} from "lucide-react";

import { auth } from "@/auth";
import ROUTES from "@/constants/routes";
import { getUserProfile } from "@/lib/actions/auth.action";

interface ProfileProps {
    params: Promise<{ id: string }>;
}

const Profile = async ({ params }: ProfileProps) => {
    const { id } = await params;

    const [session, profileResult] = await Promise.all([
        auth(),
        getUserProfile({ userId: id }),
    ]);

    if (!profileResult.success || !profileResult.data?.user) {
        notFound();
    }

    const { user, totalQuestions, totalAnswers } = profileResult.data;
    const isOwnProfile =
        Boolean(session?.user?.id) && session?.user?.id === user._id.toString();

    const initial = user.name?.[0]?.toUpperCase() ?? "?";
    const joinedDate = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
          })
        : null;

    const stats = [
        {
            label: "Questions",
            value: totalQuestions,
            icon: HelpCircle,
        },
        {
            label: "Answers",
            value: totalAnswers,
            icon: MessageSquare,
        },
        {
            label: "Reputation",
            value: user.reputation ?? 0,
            icon: Award,
        },
    ];

    return (
        <section className="space-y-8">
            {/* Profile Header Card */}
            <div className="rounded-2xl border border-[#1E293B] bg-[#080F20] p-6 sm:p-8">
                <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
                    {/* Left: Avatar + User Details */}
                    <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                        {user.image ? (
                            <Image
                                src={user.image}
                                alt={user.name}
                                width={112}
                                height={112}
                                priority
                                className="size-24 rounded-full object-cover ring-2 ring-[#FF8A00]/60 sm:size-28"
                            />
                        ) : (
                            <div className="flex size-24 items-center justify-center rounded-full bg-[#111B30] text-3xl font-bold text-[#FF8A00] ring-2 ring-[#FF8A00]/60 sm:size-28">
                                {initial}
                            </div>
                        )}

                        <div className="space-y-2">
                            <div>
                                <h1 className="text-2xl font-bold text-[#F1F5F9]">
                                    {user.name}
                                </h1>
                                <p className="text-sm font-medium text-[#94A3B8]">
                                    @{user.username}
                                </p>
                            </div>

                            {user.bio && (
                                <p className="max-w-2xl text-sm leading-relaxed text-[#CBD5E1]">
                                    {user.bio}
                                </p>
                            )}

                            {/* Meta Links: Portfolio, Location, Joined */}
                            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 text-xs text-[#94A3B8]">
                                {user.portfolio && (
                                    <a
                                        href={
                                            user.portfolio.startsWith("http")
                                                ? user.portfolio
                                                : `https://${user.portfolio}`
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 font-medium text-amber-400 transition-colors hover:text-[#FF8A00]"
                                    >
                                        <ExternalLink className="size-3.5" />
                                        <span>
                                            {user.portfolio.replace(
                                                /^https?:\/\//,
                                                "",
                                            )}
                                        </span>
                                    </a>
                                )}

                                {user.location && (
                                    <span className="inline-flex items-center gap-1.5">
                                        <MapPin className="size-3.5 text-[#64748B]" />
                                        <span>{user.location}</span>
                                    </span>
                                )}

                                {joinedDate && (
                                    <span className="inline-flex items-center gap-1.5">
                                        <Calendar className="size-3.5 text-[#64748B]" />
                                        <span>Joined {joinedDate}</span>
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Edit Profile Button (Owner Only) */}
                    {isOwnProfile && (
                        <Link
                            href={
                                ROUTES.PROFILE_EDIT(user._id.toString()) ??
                                `/profile/${user._id.toString()}/edit`
                            }
                            className="inline-flex shrink-0 items-center gap-2 self-start rounded-xl border border-[#FF8A00]/60 bg-[#FF8A00]/15 px-4 py-2.5 text-xs font-semibold text-[#FF8A00] transition-colors hover:bg-[#FF8A00]/25"
                        >
                            <Pencil className="size-3.5" />
                            <span>Edit Profile</span>
                        </Link>
                    )}
                </div>
            </div>

            {/* Stats Row */}
            <div>
                <h2 className="mb-4 text-lg font-bold text-[#F1F5F9]">Stats</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={stat.label}
                                className="flex items-center gap-4 rounded-xl border border-[#1E293B] bg-[#080F20] p-5"
                            >
                                <div className="flex size-11 items-center justify-center rounded-xl bg-[#111B30] text-[#FF8A00] ring-1 ring-[#1E293B]">
                                    <Icon className="size-5" />
                                </div>
                                <div>
                                    <p className="text-xl font-bold text-[#F1F5F9]">
                                        {stat.value}
                                    </p>
                                    <p className="text-xs font-medium text-[#94A3B8]">
                                        {stat.label}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Profile;

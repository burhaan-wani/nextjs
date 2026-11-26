import Image from "next/image";
import Link from "next/link";
import ROUTES from "@/constants/routes";
import { IUser } from "@/database/user.model";

interface UserCardProps {
    user: IUser;
}

const UserCard = ({ user }: UserCardProps) => {
    const userId = user._id.toString();
    const initial = user.name?.[0]?.toUpperCase() ?? "?";

    return (
        <article className="flex flex-col justify-between rounded-xl border border-[#1E293B] bg-[#080F20] p-6 transition-colors hover:border-[#334155]">
            <div>
                <Link
                    href={ROUTES.PROFILE(userId)}
                    className="flex flex-col items-center text-center"
                >
                    {user.image ? (
                        <Image
                            src={user.image}
                            alt={user.name}
                            width={84}
                            height={84}
                            className="size-20 rounded-full object-cover ring-2 ring-[#1E293B]"
                        />
                    ) : (
                        <div className="flex size-20 items-center justify-center rounded-full bg-[#111B30] text-2xl font-bold text-[#FF8A00] ring-2 ring-[#1E293B]">
                            {initial}
                        </div>
                    )}

                    <h2 className="mt-4 line-clamp-1 text-lg font-bold text-[#F1F5F9] transition-colors hover:text-[#FF8A00]">
                        {user.name}
                    </h2>
                    <p className="mt-0.5 text-sm text-[#94A3B8]">
                        @{user.username}
                    </p>
                </Link>

                {user.bio && (
                    <p className="mt-3 line-clamp-2 text-center text-xs leading-relaxed text-[#CBD5E1]">
                        {user.bio}
                    </p>
                )}
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-[#1E293B] pt-4 text-xs text-[#94A3B8]">
                <span className="rounded-md bg-[#111B30] px-2.5 py-1 font-medium text-[#FF8A00]">
                    {user.reputation ?? 0} Rep
                </span>

                {user.location ? (
                    <span className="truncate max-w-[140px]">
                        {user.location}
                    </span>
                ) : user.portfolio ? (
                    <a
                        href={user.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate max-w-[140px] text-amber-400 hover:underline"
                    >
                        Portfolio ↗
                    </a>
                ) : null}
            </div>
        </article>
    );
};

export default UserCard;

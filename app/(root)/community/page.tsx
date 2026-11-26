import UserCard from "@/components/cards/UserCard";
import SearchBar from "@/components/search/SearchBar";
import ROUTES from "@/constants/routes";
import { IUser } from "@/database/user.model";
import { getAllUsers } from "@/lib/actions/auth.action";
import { RouteParams } from "@/types/global";
import { Suspense } from "react";

export const instant = false;

const Community = async ({ searchParams }: RouteParams) => {
    const { query, filter, page, pageSize } = await searchParams;

    const { success, data, error } = await getAllUsers({
        query,
        filter,
        page: Number(page) || 1,
        pageSize: Number(pageSize) || 10,
    });

    const users: IUser[] = Array.isArray(data) ? data : (data?.users ?? []);

    return (
        <div>
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-[#F1F5F9]">All Users</h1>
            </div>

            <div className="mt-6">
                <SearchBar
                    route={ROUTES.COMMUNITY}
                    className="w-full"
                    placeHolder="Search people..."
                />
            </div>

            <div className="mt-8">
                {!success ? (
                    <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-6 text-center text-sm text-rose-300">
                        {error?.message || "Failed to load users."}
                    </div>
                ) : users.length === 0 ? (
                    <div className="rounded-xl border border-[#1E293B] bg-[#080F20] p-10 text-center">
                        <p className="text-base font-semibold text-[#F1F5F9]">
                            No users found
                        </p>
                        <p className="mt-1 text-sm text-[#94A3B8]">
                            {query
                                ? `No community members matched "${query}".`
                                : "Be the first to join the community."}
                        </p>
                    </div>
                ) : (
                    <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                        <Suspense fallback={<div>Loading...</div>}>
                            {users.map((user) => (
                                <UserCard
                                    key={user._id.toString()}
                                    user={user}
                                />
                            ))}
                        </Suspense>
                    </section>
                )}
            </div>
        </div>
    );
};

export default Community;

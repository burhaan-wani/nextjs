import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import { IAccount } from "./database/account.model";
import { IUser } from "./database/user.model";
import { api } from "./lib/handlers/api";
import { loginSchema } from "./lib/validations";
import { ActionResponse } from "./types/global";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        GitHub,
        Google,
        Credentials({
            async authorize(credentials) {
                const validatedData = loginSchema.safeParse(credentials);
                if (!validatedData.success) return null;

                const email = validatedData.data.email.toLowerCase().trim();
                const { password } = validatedData.data;

                const { data: existingAccount } =
                    (await api.accounts.getByProvider(
                        email,
                    )) as ActionResponse<IAccount>;
                if (!existingAccount || !existingAccount.password) return null;

                const { data: existingUser } = (await api.users.getById(
                    existingAccount.userId.toString(),
                )) as ActionResponse<IUser>;
                if (!existingUser) return null;

                const isValidPassword = await bcrypt.compare(
                    password,
                    existingAccount.password,
                );
                if (!isValidPassword) return null;

                return {
                    id: existingUser._id.toString(),
                    name: existingUser.name,
                    email: existingUser.email,
                    image: existingUser.image,
                };
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            if (token.sub) {
                session.user.id = token.sub;
            }
            return session;
        },
        async jwt({ token, user, account }) {
            if (user) {
                token.email = user.email;
            }

            if (account) {
                const lookupKey =
                    account.type === "credentials"
                        ? (user?.email || token.email || "")
                              .toLowerCase()
                              .trim()
                        : account.providerAccountId;

                if (!lookupKey) return token;

                const { data: existingAccount, success } =
                    (await api.accounts.getByProvider(
                        lookupKey,
                    )) as ActionResponse<IAccount>;

                if (success && existingAccount?.userId) {
                    token.sub = existingAccount.userId.toString();
                }
            }

            return token;
        },
        async signIn({ user, account, profile }) {
            if (account?.type === "credentials") return true;
            if (!account || !user?.email) return false;

            const baseUsername =
                account.provider === "github"
                    ? (profile?.login as string)
                    : user.name?.toLowerCase().replace(/[^a-z0-9_]/g, "") ||
                      user.email.split("@")[0].replace(/[^a-z0-9_]/g, "");

            const username =
                baseUsername && baseUsername.length >= 3
                    ? baseUsername
                    : `${baseUsername || "user"}_${account.providerAccountId.slice(-4)}`;

            const userInfo = {
                name: user.name || user.email.split("@")[0],
                email: user.email.toLowerCase().trim(),
                image: user.image ?? "",
                username,
            };

            const { success } = (await api.auth.oAuthSignIn({
                user: userInfo,
                provider: account.provider as "github" | "google",
                providerAccountId: account.providerAccountId,
            })) as ActionResponse;

            return Boolean(success);
        },
    },
});

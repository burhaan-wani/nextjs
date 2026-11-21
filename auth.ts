import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { api } from "./lib/handlers/api";
import { ActionResponse } from "./types/global";
import { IAccount } from "./database/account.model";
import { registerSchema } from "./lib/validations";
import { IUser } from "./database/user.model";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        GitHub,
        Google,
        Credentials({
            async authorize(credentials) {
                console.log("Credentials: ", credentials);
                const validatedData = registerSchema.safeParse(credentials);
                if (validatedData.success) {
                    const { email, password } = validatedData.data;
                    const { data: existingAccount } =
                        (await api.accounts.getByProvider(
                            email,
                        )) as ActionResponse<IAccount>;
                    if (!existingAccount) return null;

                    const { data: existingUser } = (await api.users.getById(
                        existingAccount.userId.toString(),
                    )) as ActionResponse<IUser>;

                    if (!existingUser) return null;

                    const isValidPassword = await bcrypt.compare(
                        password,
                        existingAccount.password!,
                    );
                    if (isValidPassword) {
                        return {
                            id: existingUser._id.toString(),
                            name: existingUser.name,
                            email: existingUser.email,
                            image: existingUser.image,
                        };
                    }
                    return null;
                }
                return null;
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            session.user.id = token.sub as string;
            return session;
        },
        async jwt({ account, token }) {
            if (account) {
                const { data: existingAccount, success } =
                    (await api.accounts.getByProvider(
                        account.type === "credentials"
                            ? token.email!
                            : account.providerAccountId,
                    )) as ActionResponse<IAccount>;
                if (!success || !existingAccount) return token;

                const userId = existingAccount.userId.toString();
                if (userId) token.sub = userId;
            }
            return token;
        },
        async signIn({ user, account, profile }) {
            if (account?.type === "credentials") return true;
            if (!account || !user) return false;

            const userInfo = {
                name: user.name!,
                email: user.email!,
                image: user.image!,
                username:
                    account.provider === "github"
                        ? (profile?.login as string)
                        : (user.name?.toLowerCase() as string),
            };

            const { success } = (await api.auth.oAuthSignIn({
                user: userInfo,
                provider: account.provider as "github" | "google",
                providerAccountId: account.providerAccountId,
            })) as ActionResponse;

            if (!success) return false;
            return true;
        },
    },
});

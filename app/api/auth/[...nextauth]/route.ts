import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma) as any,
    providers: [
        // LINE Provider (Optional - ถ้าต้องการให้ Admin login ด้วย LINE)
        // {
        //   id: 'line',
        //   name: 'LINE',
        //   type: 'oauth',
        //   authorization: {
        //     url: 'https://access.line.me/oauth2/v2.1/authorize',
        //     params: { scope: 'profile openid email' }
        //   },
        //   token: 'https://api.line.me/oauth2/v2.1/token',
        //   userinfo: 'https://api.line.me/v2/profile',
        //   clientId: process.env.LINE_CLIENT_ID,
        //   clientSecret: process.env.LINE_CLIENT_SECRET,
        //   profile(profile) {
        //     return {
        //       id: profile.userId,
        //       name: profile.displayName,
        //       email: null,
        //       image: profile.pictureUrl,
        //     };
        //   },
        // },

        // Credentials Provider (Email/Password สำหรับ Admin)
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                // TODO: ตรวจสอบ password จริง (ควรใช้ bcrypt)
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                });

                if (!user) {
                    return null;
                }

                // สำหรับ development - ยอมรับ password ใดๆ ก็ได้
                // TODO: เปลี่ยนเป็นตรวจสอบ password จริง
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                };
            }
        })
    ],
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.sub;
                (session.user as any).role = token.role;
            }
            return session;
        },
    },
    pages: {
        signIn: '/admin/login',
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

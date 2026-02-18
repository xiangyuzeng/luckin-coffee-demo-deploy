import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import prisma from '../../prisma/client';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { compare } from 'bcryptjs';
import { NextAuthOptions } from 'next-auth';
import { Adapter } from 'next-auth/adapters';
import { loginFormSchema } from './validation/loginFormSchema';

const providers: NextAuthOptions['providers'] = [
  CredentialsProvider({
    name: 'Credentials',
    credentials: {
      username: { label: 'Username', type: 'text', placeholder: 'Username' },
      email: { label: 'Email', type: 'email', placeholder: 'email@example.com' },
      password: { label: 'Password', type: 'password' }
    },
    async authorize(credentials, req) {
      const parsedCredentials = loginFormSchema.safeParse(credentials);

      if (parsedCredentials.success) {
        const { email, password } = parsedCredentials.data;
        if (!email || !password) return null;

        const existUserByEmail = await prisma.user.findUnique({
          where: { email }
        });

        if (!existUserByEmail) return null;

        const passwordMatch = await compare(
          password,
          existUserByEmail.password!
        );

        if (!passwordMatch) return null;

        return {
          id: existUserByEmail.id,
          username: existUserByEmail.username,
          email: existUserByEmail.email,
          phone: existUserByEmail.phone,
          role: existUserByEmail.role,
          provider: existUserByEmail.provider
        };
      } else return null;
    }
  })
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.unshift(
    GoogleProvider({
      id: 'google',
      name: 'Google',
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true
    })
  );
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/',
    signOut: '/'
  },
  providers,
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === 'update') {
        token.username = session.user.username;
        token.email = session.user.email;
        token.phone = session.user.phone;
        return token;
      }

      if (user) {
        return {
          ...token,
          username: user.username,
          email: user.email,
          role: user.role,
          id: user.id,
          provider: user.provider,
          phone: user.phone
        };
      }

      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          username: token.username,
          email: token.email,
          role: token.role,
          id: token.id,
          provider: token.provider,
          phone: token.phone
        }
      };
    },
    async signIn({ account, profile }) {
      if (account?.provider === 'google') {
        try {
          const existUserByEmail = await prisma.user.findUnique({
            where: { email: profile?.email }
          });

          if (!existUserByEmail) {
            await prisma.user.create({
              data: {
                id: profile?.sub,
                username: profile?.name as string,
                email: profile?.email as string,
                phone: '',
                image: profile?.image,
                provider: 'GOOGLE',
                loyaltyAccount: {
                  create: {
                    points: 0,
                    totalEarned: 0,
                    tier: 'BRONZE'
                  }
                },
                preferences: {
                  create: {}
                }
              }
            });
          } else {
            const hasLoyalty = await prisma.loyaltyAccount.findUnique({
              where: { userId: existUserByEmail.id }
            });
            if (!hasLoyalty) {
              await prisma.loyaltyAccount.create({
                data: { userId: existUserByEmail.id, points: 0, totalEarned: 0, tier: 'BRONZE' }
              });
            }
            const hasPrefs = await prisma.userPreferences.findUnique({
              where: { userId: existUserByEmail.id }
            });
            if (!hasPrefs) {
              await prisma.userPreferences.create({
                data: { userId: existUserByEmail.id }
              });
            }
          }
          return true;
        } catch (error) {
          console.log('Error occurred: ', error);
          return false;
        }
      }

      return true;
    }
  }
};

import type { NextAuthConfig } from 'next-auth';

const PUBLIC_PATHS = ['/login', '/signup'];

// Edge-safe config (no adapter, no Node-only providers) so this can run in middleware.
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = request.nextUrl;
      const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

      if (isPublicPath) {
        if (isLoggedIn) {
          return Response.redirect(new URL('/', request.nextUrl));
        }
        return true;
      }

      if (!isLoggedIn) {
        return false; // redirects to pages.signIn
      }

      // US-001 DEC-11/AC1/AC3: OAuth sign-ins skip role/age-band capture, so route them
      // to onboarding until both are set.
      if (pathname.startsWith('/onboarding')) {
        return true;
      }
      if (!auth.user.role || !auth.user.ageBand) {
        return Response.redirect(new URL('/onboarding', request.nextUrl));
      }

      return true;
    },
    // Kept here (not just in auth.ts) so proxy.ts's edge-only NextAuth instance
    // also sees role/ageBand on the session when deciding onboarding redirects.
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = user.role ?? null;
        token.ageBand = user.ageBand ?? null;
      }
      // Lets the onboarding server action refresh the session after it updates the DB
      if (trigger === 'update' && session) {
        token.role = session.user?.role ?? token.role;
        token.ageBand = session.user?.ageBand ?? token.ageBand;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role ?? null;
        session.user.ageBand = token.ageBand ?? null;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

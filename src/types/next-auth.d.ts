import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      role: string | null;
      ageBand: string | null;
    } & DefaultSession['user'];
  }

  interface User {
    role?: string | null;
    ageBand?: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string | null;
    ageBand?: string | null;
  }
}

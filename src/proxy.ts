import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';

// Edge-safe: only the base config (no adapter/DB, no Credentials provider) is loaded here.
const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.\\w+$).*)'],
};

'use server';

import { signOut } from '@/auth';

// US-001 AC7: signing out ends the session
export async function logout() {
  await signOut({ redirectTo: '/login' });
}

'use server';

import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { forgotPasswordSchema } from '@/lib/validation/auth';

export type ForgotPasswordState =
  | {
      error?: string;
      fieldErrors?: Record<string, string[] | undefined>;
      success?: boolean;
    }
  | undefined;

export async function resetPassword(
  _prevState: ForgotPasswordState,
  formData: FormData
): Promise<ForgotPasswordState> {
  const parsed = forgotPasswordSchema.safeParse({
    email: formData.get('email'),
    newPassword: formData.get('newPassword'),
    confirmNewPassword: formData.get('confirmNewPassword'),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { email, newPassword } = parsed.data;

  const [existing] = await db
    .select({ id: users.id, password: users.password })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  // AC2/AC5 + AS-019.1: no proof of email ownership is checked here — if a password
  // account matches, it is reset; otherwise this is a silent no-op. Either way the
  // caller sees the same generic `success` result (AS-019.2, avoids account enumeration).
  if (existing?.password != null) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.update(users).set({ password: hashedPassword }).where(eq(users.id, existing.id));
  }

  return { success: true };
}

'use client';

import { useActionState, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ageBandOptions } from '@/lib/validation/auth';
import { signup } from './actions';

export function SignUpForm() {
  const [state, formAction, pending] = useActionState(signup, undefined);
  const [role, setRole] = useState<'learner' | 'tutor'>('learner');

  return (
    <form action={formAction} className="space-y-4">
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">I am signing up as a... (DEC-11)</legend>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-input p-3 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
            <input
              type="radio"
              name="role"
              value="learner"
              checked={role === 'learner'}
              onChange={() => setRole('learner')}
              className="size-4"
            />
            <span className="text-sm font-medium">Learner</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-input p-3 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
            <input
              type="radio"
              name="role"
              value="tutor"
              checked={role === 'tutor'}
              onChange={() => setRole('tutor')}
              className="size-4"
            />
            <span className="text-sm font-medium">Tutor</span>
          </label>
        </div>
        {state?.fieldErrors?.role && (
          <p className="text-sm text-destructive">{state.fieldErrors.role[0]}</p>
        )}
      </fieldset>

      <div className="space-y-1.5">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" autoComplete="name" required />
        {state?.fieldErrors?.name && (
          <p className="text-sm text-destructive">{state.fieldErrors.name[0]}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="username" required />
        {state?.fieldErrors?.email && (
          <p className="text-sm text-destructive">{state.fieldErrors.email[0]}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
        />
        {state?.fieldErrors?.password && (
          <p className="text-sm text-destructive">{state.fieldErrors.password[0]}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="ageBand">Age band *</Label>
        <select
          id="ageBand"
          name="ageBand"
          required
          defaultValue=""
          className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <option value="" disabled>
            Select an age band
          </option>
          {ageBandOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <p className="text-sm text-muted-foreground">
          Required to create an account (AC3). Minimum age is 6, applied globally (DEC-9).
        </p>
        {state?.fieldErrors?.ageBand && (
          <p className="text-sm text-destructive">{state.fieldErrors.ageBand[0]}</p>
        )}
      </div>

      {role === 'tutor' && (
        <label className="flex items-start gap-2 text-sm text-muted-foreground">
          <input type="checkbox" name="rightsConfirmed" className="mt-1 size-4" />
          I confirm any media I later upload will be rights-cleared by me (AC8, DEC-27).
        </label>
      )}
      {state?.fieldErrors?.rightsConfirmed && (
        <p className="text-sm text-destructive">{state.fieldErrors.rightsConfirmed[0]}</p>
      )}

      {state?.error && (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? 'Creating account…' : 'Create account'}
      </Button>
    </form>
  );
}

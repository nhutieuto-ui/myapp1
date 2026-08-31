'use client';

import { useActionState, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ageBandOptions } from '@/lib/validation/auth';
import { completeOnboarding } from './actions';

export function OnboardingForm() {
  const [state, formAction, pending] = useActionState(completeOnboarding, undefined);
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
        <label htmlFor="ageBand" className="text-sm font-medium">
          Age band *
        </label>
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
          Required to continue (AC3). Minimum age is 6, applied globally (DEC-9).
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
        {pending ? 'Saving…' : 'Continue'}
      </Button>
    </form>
  );
}

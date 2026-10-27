'use client';

import { useRef, useState, type FormEvent } from 'react';
import { levelContent, levelOrder, signup } from '@/content/landing';
import { submitSignup } from '@/lib/signup';
import { validateSignup, type SignupErrors } from '@/lib/validation';
import type { Level } from '@/lib/types';
import { useLevel } from '@/components/LevelContext';
import { buttonStyles } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { SectionHeading } from '@/components/ui/SectionHeading';

type Status = 'idle' | 'loading' | 'success' | 'error';

const isLevel = (value: string): value is Level => (levelOrder as readonly string[]).includes(value);

export function SignupCta() {
  const { level, setLevel } = useLevel();
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<SignupErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const emailRef = useRef<HTMLInputElement>(null);
  const agreeRef = useRef<HTMLInputElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === 'loading') return;

    const data = { email: email.trim(), level, agreed };
    const nextErrors = validateSignup(data);
    setErrors(nextErrors);
    if (nextErrors.email) return emailRef.current?.focus();
    if (nextErrors.agreed) return agreeRef.current?.focus();

    setStatus('loading');
    setErrorMessage('');
    try {
      const result = await submitSignup(data);
      if (result.ok) {
        setStatus('success');
        requestAnimationFrame(() => successRef.current?.focus());
      } else {
        setStatus('error');
        setErrorMessage(result.message);
      }
    } catch {
      setStatus('error');
      setErrorMessage(signup.genericError);
    }
  };

  const reset = () => {
    setEmail('');
    setAgreed(false);
    setErrors({});
    setStatus('idle');
    requestAnimationFrame(() => emailRef.current?.focus());
  };

  const loading = status === 'loading';

  return (
    <section
      id="signup"
      aria-labelledby="signup-title"
      className="scroll-mt-16 bg-linear-to-br from-teal-700 via-cyan-800 to-sky-900 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-xl px-4 sm:px-6">
        <SectionHeading
          id="signup-title"
          eyebrow={signup.eyebrow}
          title={signup.title}
          description={signup.description}
          tone="inverse"
        />

        <div className="rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
          {status === 'success' ? (
            <div ref={successRef} tabIndex={-1} role="status" className="text-center">
              <span className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                <Icon name="check" className="size-8" />
              </span>
              <p className="mt-4 text-lg font-bold text-slate-900">{signup.success}</p>
              <button
                type="button"
                onClick={reset}
                className="mt-6 text-sm font-bold text-teal-800 underline underline-offset-4"
              >
                {signup.resetLabel}
              </button>
            </div>
          ) : (
            <form noValidate onSubmit={handleSubmit} aria-busy={loading} className="flex flex-col gap-5">
              <div>
                <label htmlFor="signup-email" className="block font-bold text-slate-900">
                  {signup.emailLabel} <span className="text-sm text-accent">({signup.requiredMark})</span>
                </label>
                <input
                  ref={emailRef}
                  id="signup-email"
                  type="email"
                  name="email"
                  inputMode="email"
                  autoComplete="email"
                  required
                  placeholder={signup.emailPlaceholder}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  aria-invalid={errors.email ? true : undefined}
                  aria-describedby={errors.email ? 'signup-email-error' : undefined}
                  disabled={loading}
                  className={`mt-2 w-full rounded-xl border-2 px-4 py-3 text-base text-slate-900 placeholder:text-slate-500 ${
                    errors.email ? 'border-red-600' : 'border-slate-300 focus:border-teal-600'
                  }`}
                />
                {errors.email ? (
                  <p id="signup-email-error" className="mt-2 text-sm font-medium text-red-700">
                    {errors.email}
                  </p>
                ) : null}
              </div>

              <div>
                <label htmlFor="signup-level" className="block font-bold text-slate-900">
                  {signup.levelLabel}
                </label>
                <select
                  id="signup-level"
                  name="level"
                  value={level}
                  onChange={(e) => {
                    if (isLevel(e.target.value)) setLevel(e.target.value);
                  }}
                  disabled={loading}
                  className="mt-2 w-full rounded-xl border-2 border-slate-300 bg-white px-4 py-3 text-base text-slate-900 focus:border-teal-600"
                >
                  {levelOrder.map((key) => (
                    <option key={key} value={key}>
                      {levelContent[key].label} · {levelContent[key].title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-start gap-3">
                  <input
                    ref={agreeRef}
                    id="signup-agree"
                    type="checkbox"
                    name="agreed"
                    required
                    checked={agreed}
                    onChange={(e) => {
                      setAgreed(e.target.checked);
                      if (errors.agreed) setErrors((prev) => ({ ...prev, agreed: undefined }));
                    }}
                    aria-invalid={errors.agreed ? true : undefined}
                    aria-describedby={`signup-agree-detail${errors.agreed ? ' signup-agree-error' : ''}`}
                    disabled={loading}
                    className="mt-1 size-5 shrink-0 accent-teal-700"
                  />
                  <label htmlFor="signup-agree" className="text-sm font-medium text-slate-800">
                    {signup.agreeLabel}
                  </label>
                </div>
                <p id="signup-agree-detail" className="mt-1 pl-8 text-xs text-slate-600">
                  {signup.agreeDetail}
                </p>
                {errors.agreed ? (
                  <p id="signup-agree-error" className="mt-2 pl-8 text-sm font-medium text-red-700">
                    {errors.agreed}
                  </p>
                ) : null}
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`${buttonStyles()} w-full`}
              >
                {loading ? (
                  <span
                    className="size-5 animate-spin rounded-full border-2 border-white/40 border-t-white"
                    aria-hidden="true"
                  />
                ) : null}
                {loading ? signup.submitting : signup.submit}
              </button>

              <p role="alert" className="min-h-0 text-center text-sm font-medium text-red-700 empty:hidden">
                {status === 'error' ? errorMessage : ''}
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

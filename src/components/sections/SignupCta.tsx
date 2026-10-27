'use client';

import { useRef, useState, type FormEvent, type ReactNode } from 'react';
import { levelOrder, signup } from '@/content/landing';
import { submitSignup } from '@/lib/signup';
import type { ReferralSource, SignupData, SwimFrequency } from '@/lib/types';
import {
  formatPhone,
  normalizePhone,
  signupFieldOrder,
  validateSignup,
  type SignupDraft,
  type SignupErrors,
  type SignupField,
} from '@/lib/validation';
import { useLevel } from '@/components/LevelContext';
import { buttonStyles } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { SectionHeading } from '@/components/ui/SectionHeading';

type Status = 'idle' | 'loading' | 'success' | 'error';

type FormValues = {
  name: string;
  phone: string;
  email: string;
  frequency: SwimFrequency | '';
  goal: string;
  referral: ReferralSource | '';
  agreed: boolean;
};

const emptyValues: FormValues = { name: '', phone: '', email: '', frequency: '', goal: '', referral: '', agreed: false };

const referralKeys = Object.keys(signup.referralOptions) as ReferralSource[];
const frequencyKeys = Object.keys(signup.frequencyOptions) as SwimFrequency[];

const inputClass =
  'mt-4 w-full border-0 border-b-2 bg-transparent px-0 py-2 text-base text-slate-900 placeholder:text-slate-500 focus:border-teal-600 focus:ring-0';

/** 구글 폼처럼 질문 하나를 카드 하나로 감싼다 */
function QuestionCard({ error, children }: { error?: string; children: ReactNode }) {
  return (
    <div className={`rounded-2xl border bg-white p-5 shadow-sm sm:p-6 ${error ? 'border-red-600' : 'border-slate-200'}`}>
      {children}
    </div>
  );
}

function RequiredMark() {
  return (
    <span className="ml-0.5 text-red-700" aria-hidden="true">
      *
    </span>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-3 flex items-center gap-1.5 text-sm font-medium text-red-700">
      <span aria-hidden="true">!</span>
      {message}
    </p>
  );
}

const errorId = (field: SignupField) => `signup-${field}-error`;

export function SignupCta() {
  const { level, chosen, setLevel, clearChosen } = useLevel();
  const [values, setValues] = useState<FormValues>(emptyValues);
  const [errors, setErrors] = useState<SignupErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const fieldRefs = useRef<Partial<Record<SignupField, HTMLInputElement | HTMLTextAreaElement | null>>>({});
  const successRef = useRef<HTMLDivElement>(null);

  const update = <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (key in errors) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const describedBy = (field: SignupField, extra?: string) =>
    [extra, errors[field] ? errorId(field) : undefined].filter(Boolean).join(' ') || undefined;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === 'loading') return;

    const goal = values.goal.trim();
    const draft: SignupDraft = {
      name: values.name.trim(),
      phone: normalizePhone(values.phone),
      email: values.email.trim(),
      agreed: values.agreed,
      ...(values.frequency ? { frequency: values.frequency } : {}),
      ...(chosen ? { level } : {}),
      ...(goal ? { goal } : {}),
      ...(values.referral ? { referral: values.referral } : {}),
    };

    const nextErrors = validateSignup(draft);
    setErrors(nextErrors);
    // 화면 순서상 첫 번째 에러 필드로 포커스 이동
    const firstInvalid = signupFieldOrder.find((field) => nextErrors[field]);
    if (firstInvalid || !draft.frequency) {
      if (firstInvalid) fieldRefs.current[firstInvalid]?.focus();
      return;
    }
    const data: SignupData = { ...draft, frequency: draft.frequency };

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

  const clearForm = () => {
    setValues(emptyValues);
    clearChosen();
    setErrors({});
    setStatus('idle');
    setErrorMessage('');
  };

  const restart = () => {
    clearForm();
    requestAnimationFrame(() => fieldRefs.current.name?.focus());
  };

  const loading = status === 'loading';

  return (
    <section
      id="signup"
      aria-labelledby="signup-title"
      className="scroll-mt-16 bg-linear-to-br from-teal-700 via-cyan-800 to-sky-900 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <SectionHeading id="signup-title" eyebrow={signup.eyebrow} title={signup.title} tone="inverse" />

        {status === 'success' ? (
          <div ref={successRef} tabIndex={-1} role="status" className="rounded-3xl bg-white p-8 text-center shadow-2xl">
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-100 text-emerald-700">
              <Icon name="check" className="size-8" />
            </span>
            <p className="mt-4 text-lg font-bold text-slate-900">{signup.success}</p>
            <button
              type="button"
              onClick={restart}
              className="mt-6 text-sm font-bold text-teal-800 underline underline-offset-4"
            >
              {signup.resetLabel}
            </button>
          </div>
        ) : (
          <form noValidate onSubmit={handleSubmit} aria-busy={loading} className="flex flex-col gap-3">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="h-2.5 bg-accent" aria-hidden="true" />
              <div className="p-5 sm:p-6">
                <p className="text-slate-700">{signup.description}</p>
                <p className="mt-4 border-t border-slate-200 pt-4 text-sm font-medium text-red-700">
                  {signup.requiredNotice}
                </p>
              </div>
            </div>

            <fieldset disabled={loading} className="flex flex-col gap-3">
              <QuestionCard error={errors.name}>
                <label htmlFor="signup-name" className="block font-bold text-slate-900">
                  {signup.nameLabel}
                  <RequiredMark />
                </label>
                <input
                  ref={(el) => {
                    fieldRefs.current.name = el;
                  }}
                  id="signup-name"
                  name="name"
                  type="text"
                  autoComplete="nickname"
                  required
                  maxLength={signup.limits.name}
                  placeholder={signup.answerPlaceholder}
                  value={values.name}
                  onChange={(e) => update('name', e.target.value)}
                  aria-invalid={errors.name ? true : undefined}
                  aria-describedby={describedBy('name')}
                  className={`${inputClass} max-w-sm ${errors.name ? 'border-red-600' : 'border-slate-300'}`}
                />
                <FieldError id={errorId('name')} message={errors.name} />
              </QuestionCard>

              <QuestionCard error={errors.phone}>
                <label htmlFor="signup-phone" className="block font-bold text-slate-900">
                  {signup.phoneLabel}
                  <RequiredMark />
                </label>
                <input
                  ref={(el) => {
                    fieldRefs.current.phone = el;
                  }}
                  id="signup-phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  required
                  placeholder={signup.phonePlaceholder}
                  value={values.phone}
                  onChange={(e) => update('phone', formatPhone(e.target.value))}
                  aria-invalid={errors.phone ? true : undefined}
                  aria-describedby={describedBy('phone')}
                  className={`${inputClass} max-w-sm ${errors.phone ? 'border-red-600' : 'border-slate-300'}`}
                />
                <FieldError id={errorId('phone')} message={errors.phone} />
              </QuestionCard>

              <QuestionCard error={errors.email}>
                <label htmlFor="signup-email" className="block font-bold text-slate-900">
                  {signup.emailLabel}
                  <RequiredMark />
                </label>
                <input
                  ref={(el) => {
                    fieldRefs.current.email = el;
                  }}
                  id="signup-email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  required
                  placeholder={signup.emailPlaceholder}
                  value={values.email}
                  onChange={(e) => update('email', e.target.value)}
                  aria-invalid={errors.email ? true : undefined}
                  aria-describedby={describedBy('email')}
                  className={`${inputClass} max-w-sm ${errors.email ? 'border-red-600' : 'border-slate-300'}`}
                />
                <FieldError id={errorId('email')} message={errors.email} />
              </QuestionCard>

              <QuestionCard error={errors.frequency}>
                <fieldset aria-describedby={describedBy('frequency')}>
                  <legend className="font-bold text-slate-900">
                    {signup.frequencyLabel}
                    <RequiredMark />
                  </legend>
                  <div className="mt-4 grid gap-1 sm:grid-cols-2">
                    {frequencyKeys.map((key, i) => (
                      <label key={key} className="flex cursor-pointer items-center gap-3 rounded-lg px-1 py-2 hover:bg-slate-50">
                        <input
                          ref={
                            i === 0
                              ? (el) => {
                                  fieldRefs.current.frequency = el;
                                }
                              : undefined
                          }
                          type="radio"
                          name="frequency"
                          value={key}
                          required
                          checked={values.frequency === key}
                          onChange={() => update('frequency', key)}
                          aria-invalid={errors.frequency ? true : undefined}
                          className="size-5 shrink-0 accent-teal-700"
                        />
                        <span className="text-slate-800">{signup.frequencyOptions[key]}</span>
                      </label>
                    ))}
                  </div>
                  <FieldError id={errorId('frequency')} message={errors.frequency} />
                </fieldset>
              </QuestionCard>

              <QuestionCard>
                <fieldset aria-describedby="signup-level-hint">
                  <legend className="font-bold text-slate-900">{signup.levelLabel}</legend>
                  <p id="signup-level-hint" className="mt-1 text-sm text-slate-600">
                    {signup.levelHint}
                  </p>
                  <div className="mt-4 grid gap-1 sm:grid-cols-3">
                    {levelOrder.map((key) => (
                      <label key={key} className="flex cursor-pointer items-center gap-3 rounded-lg px-1 py-2 hover:bg-slate-50">
                        <input
                          type="radio"
                          name="level"
                          value={key}
                          checked={chosen && level === key}
                          onChange={() => setLevel(key)}
                          className="size-5 shrink-0 accent-teal-700"
                        />
                        <span className="text-slate-800">{signup.levelOptions[key]}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              </QuestionCard>

              <QuestionCard error={errors.goal}>
                <label htmlFor="signup-goal" className="block font-bold text-slate-900">
                  {signup.goalLabel}
                </label>
                <textarea
                  ref={(el) => {
                    fieldRefs.current.goal = el;
                  }}
                  id="signup-goal"
                  name="goal"
                  rows={2}
                  maxLength={signup.limits.goal}
                  placeholder={signup.goalPlaceholder}
                  value={values.goal}
                  onChange={(e) => update('goal', e.target.value)}
                  aria-invalid={errors.goal ? true : undefined}
                  aria-describedby={describedBy('goal')}
                  className={`${inputClass} resize-none ${errors.goal ? 'border-red-600' : 'border-slate-300'}`}
                />
                <FieldError id={errorId('goal')} message={errors.goal} />
              </QuestionCard>

              <QuestionCard>
                <fieldset>
                  <legend className="font-bold text-slate-900">{signup.referralLabel}</legend>
                  <div className="mt-4 grid gap-1 sm:grid-cols-2">
                    {referralKeys.map((key) => (
                      <label key={key} className="flex cursor-pointer items-center gap-3 rounded-lg px-1 py-2 hover:bg-slate-50">
                        <input
                          type="radio"
                          name="referral"
                          value={key}
                          checked={values.referral === key}
                          onChange={() => update('referral', key)}
                          className="size-5 shrink-0 accent-teal-700"
                        />
                        <span className="text-slate-800">{signup.referralOptions[key]}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              </QuestionCard>

              <QuestionCard error={errors.agreed}>
                <fieldset>
                  <legend className="block font-bold text-slate-900">
                    {signup.agreeTitle}
                    <RequiredMark />
                  </legend>
                  <p id="signup-agree-detail" className="mt-2 text-sm text-slate-600">
                    {signup.agreeDetail}
                  </p>
                  <label className="mt-4 flex cursor-pointer items-center gap-3">
                    <input
                      ref={(el) => {
                        fieldRefs.current.agreed = el;
                      }}
                      id="signup-agree"
                      type="checkbox"
                      name="agreed"
                      required
                      checked={values.agreed}
                      onChange={(e) => update('agreed', e.target.checked)}
                      aria-invalid={errors.agreed ? true : undefined}
                      aria-describedby={describedBy('agreed', 'signup-agree-detail')}
                      className="size-5 shrink-0 accent-teal-700"
                    />
                    <span className="font-medium text-slate-800">{signup.agreeLabel}</span>
                  </label>
                  <FieldError id={errorId('agreed')} message={errors.agreed} />
                </fieldset>
              </QuestionCard>
            </fieldset>

            <div className="mt-2 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={clearForm}
                disabled={loading}
                className="rounded-full px-4 py-2 text-sm font-bold text-cyan-50 underline-offset-4 hover:underline"
              >
                {signup.clearLabel}
              </button>
              <button type="submit" disabled={loading} className={`${buttonStyles()} w-full sm:w-auto`}>
                {loading ? (
                  <span
                    className="size-5 animate-spin rounded-full border-2 border-white/40 border-t-white"
                    aria-hidden="true"
                  />
                ) : null}
                {loading ? signup.submitting : signup.submit}
              </button>
            </div>

            <p role="alert" className="rounded-xl bg-white px-4 py-3 text-center text-sm font-medium text-red-700 empty:hidden">
              {status === 'error' ? errorMessage : ''}
            </p>
          </form>
        )}
      </div>
    </section>
  );
}

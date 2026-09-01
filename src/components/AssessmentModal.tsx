import { X } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { saveAssessmentRequest } from '../lib/assessment'

const assessOptions = [
  'Enterprise',
  'Business Unit',
  'Brand',
  'Product',
  'Service',
  'Market',
] as const

const objectiveOptions = [
  'Improve AI visibility',
  'Understand competitive positioning',
  'Launch / strengthen a brand or product',
  'Enter a new market',
  'Build an AI Discoverability strategy',
  'Other',
] as const

type Props = {
  open: boolean
  onClose: () => void
}

export function AssessmentModal({ open, onClose }: Props) {
  const [assess, setAssess] = useState<string[]>([])
  const [objectives, setObjectives] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open) return null

  function toggle(list: string[], value: string, setter: (v: string[]) => void) {
    setter(list.includes(value) ? list.filter((v) => v !== value) : [...list, value])
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (assess.length === 0) {
      setSubmitError('Select at least one option to assess.')
      return
    }

    const form = new FormData(e.currentTarget)
    setSubmitting(true)
    setSubmitError('')

    try {
      await saveAssessmentRequest({
        fullName: String(form.get('fullName') || ''),
        email: String(form.get('email') || ''),
        company: String(form.get('company') || ''),
        phone: String(form.get('phone') || ''),
        assess,
        objectives,
        notes: String(form.get('notes') || ''),
      })
      setSubmitted(true)
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : 'Could not save your request. Please try again.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto overscroll-contain bg-ink/55 px-0 py-0 backdrop-blur-[2px] sm:items-center sm:px-4 sm:py-8"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="relative max-h-[min(94dvh,880px)] w-full max-w-xl overflow-y-auto overscroll-contain rounded-t-3xl bg-white shadow-2xl shadow-brand/20 sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="assessment-title"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full text-ink-soft transition hover:bg-surface hover:text-ink sm:right-4 sm:top-4"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="border-b border-line px-4 pb-4 pt-6 sm:px-8 sm:pb-5 sm:pt-7">
          <h2 id="assessment-title" className="pr-10 text-xl font-bold tracking-tight text-balance text-ink sm:text-2xl">
            Request an AI Discoverability Assessment
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Let&apos;s understand where your organisation stands and where the biggest
            opportunities are.
          </p>
        </div>

        {submitted ? (
          <div className="px-4 py-10 text-center sm:px-8 sm:py-12">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand">
              ✓
            </div>
            <h3 className="text-lg font-bold text-ink">Request received</h3>
            <p className="mt-2 text-sm text-ink-soft">
              We&apos;ll review your information and get back to you about the assessment.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-bright"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 px-4 py-5 sm:space-y-7 sm:px-8 sm:py-6">
            <fieldset className="space-y-4">
              <legend className="text-sm font-bold text-ink">Contact</legend>
              <Field label="Full Name" required placeholder="Your name" name="fullName" />
              <Field
                label="Work Email"
                required
                type="email"
                placeholder="you@company.com"
                name="email"
              />
              <Field
                label="Company / Organisation"
                required
                placeholder="Company url"
                name="company"
              />
              <Field
                label="Contact Info"
                required
                type="tel"
                placeholder="Phone No."
                name="phone"
              />
            </fieldset>

            <fieldset className="space-y-4">
              <legend className="text-sm font-bold text-ink">About your business</legend>

              <div>
                <p className="mb-2 text-sm font-medium text-ink">
                  What would you like to assess? <span className="text-brand">*</span>
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {assessOptions.map((opt) => (
                    <CheckChip
                      key={opt}
                      label={opt}
                      checked={assess.includes(opt)}
                      onChange={() => toggle(assess, opt, setAssess)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-ink">Primary objective</p>
                <div className="space-y-2">
                  {objectiveOptions.map((opt) => (
                    <label
                      key={opt}
                      className="flex min-h-11 cursor-pointer items-start gap-2.5 rounded-lg border border-line px-3 py-2.5 text-sm text-ink transition hover:border-brand/30"
                    >
                      <input
                        type="checkbox"
                        className="mt-0.5 accent-brand"
                        checked={objectives.includes(opt)}
                        onChange={() => toggle(objectives, opt, setObjectives)}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-ink">
                  Anything you&apos;d like us to know?
                </span>
                <textarea
                  name="notes"
                  rows={4}
                  placeholder="Tell us briefly about your business or what you're trying to achieve..."
                  className="w-full resize-y rounded-xl border border-line bg-white px-3.5 py-3 text-base text-ink outline-none placeholder:text-ink-soft/70 focus:border-brand focus:ring-2 focus:ring-brand/15 sm:py-2.5 sm:text-sm"
                />
              </label>
            </fieldset>

            <div>
              {submitError ? (
                <p className="mb-3 text-center text-sm text-red-600">{submitError}</p>
              ) : null}
              <button
                type="submit"
                disabled={submitting}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-brand-bright to-brand-deep px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? 'Submitting…' : 'Request My Assessment →'}
              </button>
              <p className="mt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center text-xs text-ink-soft">
                We&apos;ll review your information and get back to you about the assessment.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

function Field({
  label,
  required,
  placeholder,
  name,
  type = 'text',
}: {
  label: string
  required?: boolean
  placeholder: string
  name: string
  type?: string
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">
        {label}
        {required ? <span className="text-brand">*</span> : null}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-line bg-white px-3.5 py-3 text-base text-ink outline-none placeholder:text-ink-soft/70 focus:border-brand focus:ring-2 focus:ring-brand/15 sm:py-2.5 sm:text-sm"
      />
    </label>
  )
}

function CheckChip({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <label
      className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition ${
        checked
          ? 'border-brand bg-brand-soft text-brand'
          : 'border-line text-ink hover:border-brand/30'
      }`}
    >
      <input
        type="checkbox"
        className="accent-brand"
        checked={checked}
        onChange={onChange}
      />
      {label}
    </label>
  )
}

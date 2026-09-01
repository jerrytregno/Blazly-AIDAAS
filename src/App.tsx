import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Brain,
  Building2,
  Check,
  ChevronRight,
  Eye,
  FileText,
  Gauge,
  Globe2,
  Headphones,
  HelpCircle,
  Hexagon,
  LayoutGrid,
  Link2,
  Monitor,
  Network,
  Package,
  Radio,
  RefreshCw,
  Search,
  Settings2,
  Shield,
  ShieldCheck,
  Sparkles,
  Tag,
  Target,
  ThumbsUp,
  TrendingUp,
  Users,
} from 'lucide-react'
import { type FormEvent, type ReactNode, useState } from 'react'
import { AssessmentModal } from './components/AssessmentModal'
import { analyzeWebsite, type AnalyzeResult } from './lib/analyzeWebsite'

const VIDEO_SRC =
  'https://drive.google.com/file/d/1uGNU0-IaW3xLwQDo7ICV2KJ64Ze5Vz3G/preview'

export default function App() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className="min-h-screen overflow-x-clip bg-white text-ink">
      <Hero onCta={() => setModalOpen(true)} />
      <VideoSection />
      <AuthoritySection />
      <FrameworkSection />
      <AnalyzeSection />
      <OperatingSystemSection />
      <LevelsSection />
      <LeverageSection />
      <FinalCta onPrimary={() => setModalOpen(true)} />
      <AssessmentModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}

function Hero({ onCta }: { onCta: () => void }) {
  return (
    <section className="relative mx-auto max-w-6xl px-4 pb-12 pt-8 sm:px-8 sm:pb-16 sm:pt-10 lg:pb-24 lg:pt-14">
      <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="min-w-0">
          <p className="text-xs font-bold tracking-[0.22em] text-brand uppercase">AI-DAAS</p>
          <p className="mt-2 text-xs font-bold tracking-[0.06em] text-ink uppercase sm:text-[15px] sm:tracking-[0.08em]">
            AI Discoverability as a Service
          </p>
          <h1 className="mt-4 text-[1.75rem] font-extrabold leading-[1.15] tracking-tight text-balance text-ink sm:mt-5 sm:text-5xl lg:text-[3.35rem] lg:leading-[1.08]">
            Make Your Business Discoverable to{' '}
            <span className="text-brand">AI.</span>
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-soft sm:mt-5 sm:text-[15px]">
            AI is becoming a new layer of discovery. Your customers are already asking it who to
            trust, what to choose, and where to buy.
          </p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-soft sm:text-[15px]">
            Blazly AI-DAAS helps your business become discoverable, understandable, and relevant to
            AI.
          </p>
          <button
            type="button"
            onClick={onCta}
            className="mt-7 inline-flex min-h-12 w-full max-w-md items-center justify-center gap-2 rounded-xl bg-linear-to-r from-brand-bright via-brand to-brand-deep px-4 py-3 text-center text-sm leading-snug font-semibold text-white shadow-lg shadow-brand/30 transition hover:brightness-110 sm:mt-8 sm:w-auto sm:px-6 sm:py-3.5"
          >
            <span>Request an AI Discoverability Assessment</span>
            <ArrowRight size={16} className="shrink-0" />
          </button>
        </div>

        <PreviewCard />
      </div>
    </section>
  )
}

function PreviewCard() {
  const metrics = [
    { icon: Globe2, label: 'AI mentions about your business', status: 'Strong', tone: 'text-emerald-600' },
    { icon: Hexagon, label: 'Search visibility', status: 'Moderate', tone: 'text-orange-500' },
    { icon: Shield, label: 'Authority signals', status: 'Strong', tone: 'text-emerald-600' },
    { icon: Search, label: 'Competitive presence', status: 'Needs attention', tone: 'text-red-500' },
  ]

  const queries = [
    'best project management software',
    'companies offering workflow automation',
    'alternatives to monday.com',
    'leading task management tools',
  ]

  return (
    <div className="min-w-0 rounded-2xl border border-line bg-white p-4 shadow-[0_20px_50px_-24px_rgba(77,11,182,0.35)] sm:p-6">
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <h2 className="text-sm font-semibold text-ink">AI Discoverability Preview</h2>
        <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-semibold tracking-wide text-brand uppercase">
          Preview
        </span>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-[1fr_1.1fr]">
        <div>
          <div className="flex items-end gap-1">
            <span className="text-5xl font-extrabold tracking-tight text-ink">72</span>
            <span className="mb-1.5 text-lg font-semibold text-ink-soft">/100</span>
          </div>
          <p className="mt-1 flex items-center gap-1 text-xs font-medium text-emerald-600">
            <TrendingUp size={12} /> + 12 pts vs last month
          </p>
          <svg viewBox="0 0 180 64" className="mt-4 h-16 w-full" aria-hidden>
            <defs>
              <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4d0bb6" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#4d0bb6" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0 48 C20 44, 30 40, 45 38 C70 34, 80 28, 100 24 C120 20, 140 18, 160 10 L180 8 V64 H0 Z"
              fill="url(#chartFill)"
            />
            <path
              d="M0 48 C20 44, 30 40, 45 38 C70 34, 80 28, 100 24 C120 20, 140 18, 160 10 L180 8"
              fill="none"
              stroke="#4d0bb6"
              strokeWidth="2.5"
            />
            {[45, 100, 160].map((x, i) => (
              <circle key={x} cx={x} cy={[38, 24, 10][i]} r="3.5" fill="#4d0bb6" />
            ))}
          </svg>
        </div>

        <ul className="space-y-3">
          {metrics.map(({ icon: Icon, label, status, tone }) => (
            <li key={label} className="flex items-start gap-2.5 text-xs sm:items-center">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand sm:h-7 sm:w-7">
                <Icon size={14} />
              </span>
              <span className="min-w-0 flex-1 leading-snug text-ink-soft">{label}</span>
              <span className={`shrink-0 text-right font-semibold ${tone}`}>{status}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 border-t border-line pt-4">
        <p className="mb-2.5 text-xs font-medium text-ink-soft">Top queries where you appear</p>
        <div className="relative flex items-center gap-2 overflow-hidden">
          <div className="no-scrollbar flex min-w-0 flex-1 snap-x snap-mandatory gap-2 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch]">
            {queries.map((q) => (
              <span
                key={q}
                className="snap-start shrink-0 rounded-lg bg-surface px-2.5 py-2 text-[11px] text-ink-soft"
              >
                &ldquo;{q}&rdquo;
              </span>
            ))}
          </div>
          <div className="pointer-events-none absolute top-0 right-12 bottom-1 w-8 bg-linear-to-l from-white to-transparent sm:right-14" />
          <button
            type="button"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line text-brand"
            aria-label="Next queries"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

function VideoSection() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-8 sm:py-20">
      <h2 className="text-center text-2xl font-extrabold tracking-tight text-balance text-ink sm:text-4xl">
        See How AI Sees Your Business
      </h2>
      <div className="mt-10 overflow-hidden rounded-2xl border border-line bg-[#d3d3d3] shadow-sm">
        <div className="relative aspect-video w-full bg-[#c8c8c8]">
          <iframe
            title="AI Discoverability demo"
            src={VIDEO_SRC}
            className="absolute inset-0 h-full w-full border-0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        </div>
      </div>
      <div className="mt-10">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-glow bg-white px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.14em] text-brand uppercase shadow-sm">
          <Sparkles size={12} /> The shift is here
        </span>
      </div>
    </section>
  )
}

function AuthoritySection() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-[#f6f3ff] via-white to-white px-4 py-12 sm:px-8 sm:py-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-linear-to-b from-brand-glow/40 to-transparent" />
      <div className="relative mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="min-w-0">
          <h2 className="text-2xl font-extrabold leading-tight tracking-tight text-balance text-ink sm:text-4xl">
            Your business has authority.{' '}
            <span className="text-brand">Does AI know it?</span>
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-ink-soft">
            Your expertise, reputation, products and customer trust were built over years.
          </p>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
            But AI only sees the signals available to it.
          </p>
          <p className="mt-5 text-[15px] font-bold leading-relaxed text-ink">
            If your digital presence doesn&apos;t represent the business you&apos;ve built, AI
            can&apos;t fully understand it.
          </p>
          <div className="mt-7 flex gap-3 rounded-2xl bg-brand-soft/80 p-4">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-white">
              <Sparkles size={16} />
            </span>
            <p className="text-sm leading-relaxed text-ink">
              AI is changing how your business is discovered, understood and recommended.{' '}
              <span className="font-bold text-brand">Make sure it sees the real you.</span>
            </p>
          </div>
        </div>

        <div className="relative flex flex-col items-stretch gap-3 sm:flex-row sm:items-start sm:gap-4">
          <CompareCard
            badge="Traditional Search"
            badgeClass="bg-ink"
            icon={<Search size={22} className="text-ink-soft" />}
            blurb="People search, click and research across websites."
            steps={[
              { icon: Search, label: 'Search' },
              { icon: Monitor, label: 'Website' },
              { icon: FileText, label: 'Research' },
            ]}
          />
          <div className="z-10 flex justify-center sm:absolute sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white shadow-lg shadow-brand/40">
              <ArrowRight size={16} className="rotate-90 sm:rotate-0" />
            </span>
          </div>
          <CompareCard
            badge="AI Discovery"
            badgeClass="bg-brand"
            icon={<Sparkles size={22} className="text-brand" />}
            blurb="AI understands, evaluates and recommends in seconds."
            steps={[
              { icon: HelpCircle, label: 'Question' },
              { icon: Sparkles, label: 'AI' },
              { icon: ThumbsUp, label: 'Recommendation' },
              { icon: Users, label: 'Consideration' },
            ]}
          />
        </div>
      </div>
    </section>
  )
}

function CompareCard({
  badge,
  badgeClass,
  icon,
  blurb,
  steps,
}: {
  badge: string
  badgeClass: string
  icon: ReactNode
  blurb: string
  steps: { icon: typeof Search; label: string }[]
}) {
  return (
    <div className="relative min-w-0 flex-1 overflow-hidden rounded-2xl border border-line bg-white p-4 shadow-[0_16px_40px_-28px_rgba(33,3,84,0.45)] sm:p-5">
      <span
        className={`inline-block rounded-full px-3 py-1 text-[10px] font-bold tracking-[0.12em] text-white uppercase ${badgeClass}`}
      >
        {badge}
      </span>
      <div className="mt-5">{icon}</div>
      <p className="mt-3 text-xs leading-relaxed text-ink-soft">{blurb}</p>
      <div className="mt-5 space-y-2.5">
        {steps.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-2.5 rounded-xl border border-line bg-surface/80 px-3 py-2.5 text-sm font-medium text-ink"
          >
            <Icon size={15} className="text-ink-soft" />
            {label}
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 opacity-40">
        <svg viewBox="0 0 200 40" className="h-full w-full" preserveAspectRatio="none">
          <path
            d="M0 28 Q25 10 50 22 T100 18 T150 24 T200 14"
            fill="none"
            stroke="#4d0bb6"
            strokeWidth="1.5"
          />
        </svg>
      </div>
    </div>
  )
}

function FrameworkSection() {
  const items = [
    {
      n: '01',
      label: 'Blazly Intelligence',
      title: 'Assess & Understand',
      desc: 'Measure AI visibility, competitors, opportunities and gaps.',
      icon: Brain,
    },
    {
      n: '02',
      label: 'Blazly Presence',
      title: 'Represent & Build',
      desc: 'Build the right digital representation of your business, products, services and expertise.',
      icon: Eye,
    },
    {
      n: '03',
      label: 'Blazly Authority',
      title: 'Establish & Strengthen',
      desc: 'Strengthen the evidence, reputation and references behind your business.',
      icon: Shield,
    },
    {
      n: '04',
      label: 'Blazly Evolution',
      title: 'Monitor & Adapt',
      desc: 'Monitor, experiment and continuously improve.',
      icon: RefreshCw,
    },
  ]

  return (
    <section className="bg-surface px-4 py-12 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-2xl font-extrabold tracking-tight text-balance text-ink sm:text-4xl">
          The <span className="text-brand">Blazly AI-DAAS</span> Framework
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm text-ink-soft">
          Our approach is built around four connected capabilities:
        </p>

        <div className="mt-8 grid gap-8 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          {items.map(({ n, label, title, desc, icon: Icon }, i) => (
            <div
              key={n}
              className={`px-2 lg:px-6 ${i > 0 ? 'lg:border-l lg:border-line' : ''}`}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-soft text-brand">
                <Icon size={20} />
              </span>
              <p className="mt-4 text-[11px] font-bold tracking-[0.14em] text-brand uppercase">
                {n} — {label}
              </p>
              <h3 className="mt-2 text-lg font-bold text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function normalizeWebsite(input: string) {
  const trimmed = input.trim()
  if (!trimmed) return null
  try {
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
    const parsed = new URL(withProtocol)
    if (!parsed.hostname.includes('.')) return null
    return parsed.hostname.replace(/^www\./i, '')
  } catch {
    return null
  }
}

function AnalyzeSection() {
  const pills = ['AI Visibility Score', 'Top AI Search Prompt', 'Actionable Recommendations']
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalyzeResult | null>(null)

  async function handleAnalyze(e: FormEvent) {
    e.preventDefault()
    const domain = normalizeWebsite(url)
    if (!domain) {
      setResult(null)
      setError('Enter a valid website URL (e.g. yourcompany.com).')
      return
    }

    setError('')
    setLoading(true)
    setResult(null)

    try {
      const data = await analyzeWebsite(domain)
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to analyze this website right now.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="px-4 py-8 sm:px-8 sm:py-14">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl bg-linear-to-br from-brand-deep via-[#311496] to-brand-bright px-4 py-9 text-center text-white sm:rounded-[1.75rem] sm:px-10 sm:py-16">
        <h2 className="text-xl font-extrabold tracking-tight text-balance sm:text-4xl">
          What Does AI Know About Your Business
        </h2>
        <p className="mt-3 text-sm text-white/80 sm:text-base">
          Get Your <span className="font-semibold text-white">Free</span> AI Discoverability Preview
        </p>

        <form
          className="mx-auto mt-7 flex max-w-2xl flex-col gap-2 rounded-2xl bg-white p-2 shadow-xl sm:mt-8 sm:flex-row sm:items-center sm:gap-3"
          onSubmit={handleAnalyze}
        >
          <div className="flex min-w-0 flex-1 items-center gap-2 px-3">
            <Link2 size={18} className="shrink-0 text-brand" />
            <input
              type="text"
              inputMode="url"
              autoComplete="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value)
                if (error) setError('')
              }}
              placeholder="Enter Your Website URL"
              className="w-full min-w-0 border-0 bg-transparent py-2.5 text-base text-ink outline-none placeholder:text-ink-soft/70 sm:text-sm"
              aria-invalid={Boolean(error)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-deep px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
          >
            {loading ? 'Analyzing…' : 'Analyze My Business'}
            {!loading ? <ArrowRight size={15} /> : null}
          </button>
        </form>

        {error ? (
          <p className="mx-auto mt-4 max-w-2xl text-sm text-red-200">{error}</p>
        ) : null}

        {loading ? (
          <p className="mx-auto mt-4 max-w-2xl text-sm text-white/75">
            Analyzing how AI currently discovers and describes your business…
          </p>
        ) : null}

        {result ? (
          <div className="mx-auto mt-5 grid max-w-4xl gap-3 text-left sm:grid-cols-3">
            <article className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-[11px] font-semibold tracking-[0.14em] text-white/70 uppercase">
                AI Visibility Score
              </p>
              <p className="mt-3 text-4xl font-extrabold tracking-tight text-white">
                {result.score}
                <span className="text-lg font-semibold text-white/70">/100</span>
              </p>
              <p className="mt-3 text-xs leading-relaxed text-white/85">{result.summary}</p>
            </article>

            <article className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-[11px] font-semibold tracking-[0.14em] text-white/70 uppercase">
                Top AI Search Prompts
              </p>
              <ul className="mt-3 space-y-2">
                {result.prompts.map((prompt) => (
                  <li
                    key={prompt}
                    className="rounded-lg bg-white/10 px-2.5 py-2 text-xs leading-snug text-white/90"
                  >
                    “{prompt}”
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-[11px] font-semibold tracking-[0.14em] text-white/70 uppercase">
                Actionable Recommendations
              </p>
              <ul className="mt-3 space-y-2">
                {result.recommendations.map((item) => (
                  <li key={item} className="flex gap-2 text-xs leading-snug text-white/90">
                    <Check size={14} className="mt-0.5 shrink-0 text-[#c4b5fd]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        ) : null}

        <div className="mx-auto mt-8 flex max-w-3xl items-center gap-3 sm:mt-10 sm:gap-4">
          <div className="h-px flex-1 bg-white/20" />
          <p className="shrink-0 text-[11px] font-semibold tracking-[0.14em] text-white/70 uppercase sm:tracking-[0.2em]">
            What You&apos;ll Get
          </p>
          <div className="h-px flex-1 bg-white/20" />
        </div>

        <div className="mt-5 flex flex-col items-stretch justify-center gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
          {pills.map((p) => (
            <span
              key={p}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2.5 text-xs font-medium text-white backdrop-blur-sm sm:w-auto"
            >
              <Check size={14} className="text-[#c4b5fd]" />
              {p}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

function OperatingSystemSection() {
  const traits = [
    { icon: Radio, title: 'Always On', desc: 'Continuously scans, learns and adapts.' },
    {
      icon: Brain,
      title: 'AI-Native',
      desc: 'Built for how AI discovers and evaluates businesses.',
    },
    {
      icon: ShieldCheck,
      title: 'Comprehensive',
      desc: 'Covers every signal that influences AI perception.',
    },
    {
      icon: BarChart3,
      title: 'Compounding',
      desc: 'Grow your signals today, higher visibility tomorrow.',
    },
  ]

  return (
    <section className="relative px-4 py-12 sm:px-8 sm:py-24">
      <div className="pointer-events-none absolute top-10 right-0 hidden h-64 w-64 opacity-40 sm:block dot-grid" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-[11px] font-bold tracking-[0.14em] text-brand uppercase sm:tracking-[0.18em]">
            <Gauge size={14} className="shrink-0" /> AI-DAAS Operating System
          </p>
          <h2 className="mt-4 text-2xl font-extrabold leading-tight tracking-tight text-balance text-ink sm:text-4xl">
            Discoverability isn&apos;t a score.
            <br />
            <span className="text-brand">It&apos;s an operating system.</span>
          </h2>
          <div className="mt-4 h-1 w-12 rounded-full bg-brand" />
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink-soft">
            AI-DAAS works continuously to make your business discoverable, understood and trusted by
            AI.
          </p>
          <div className="mt-6 flex gap-3 rounded-2xl border border-line bg-white p-4 shadow-sm">
            <Sparkles size={18} className="mt-0.5 shrink-0 text-brand" />
            <p className="text-sm leading-relaxed text-ink">
              <span className="font-bold">AI-DAAS</span> — An always-on system that adapts, evolves
              and compounds your discoverability.
            </p>
          </div>
        </div>

        <OsCycleDiagram />
      </div>

      <div className="mx-auto mt-10 grid max-w-6xl gap-3 rounded-2xl border border-line bg-white p-3 shadow-[0_16px_40px_-30px_rgba(33,3,84,0.4)] sm:mt-16 sm:grid-cols-2 sm:p-4 lg:grid-cols-4 lg:gap-0 lg:p-2">
        {traits.map(({ icon: Icon, title, desc }, i) => (
          <div
            key={title}
            className={`flex gap-3 px-3 py-3 ${i > 0 ? 'lg:border-l lg:border-line' : ''}`}
          >
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
              <Icon size={16} />
            </span>
            <div>
              <p className="text-sm font-bold text-ink">{title}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-ink-soft">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function OsCycleDiagram() {
  const nodes = [
    {
      title: 'Discover',
      desc: 'Understand your AI visibility.',
      icon: Search,
      x: 50,
      y: 12,
    },
    {
      title: 'Represent',
      desc: 'Build your digital presence.',
      icon: Target,
      x: 80,
      y: 50,
    },
    {
      title: 'Establish',
      desc: 'Strengthen authority and relevance.',
      icon: Shield,
      x: 50,
      y: 90,
    },
    {
      title: 'Evolve',
      desc: 'Monitor, adapt and improve continuously.',
      icon: RefreshCw,
      x: 20,
      y: 50,
    },
  ]

  return (
    <>
      <div className="mx-auto w-full max-w-sm sm:hidden">
        {nodes.map(({ title, desc, icon: Icon }, i) => (
          <div key={title}>
            <div className="flex items-start gap-3 rounded-2xl border border-line bg-white p-3.5 shadow-sm">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#ddd6fe] bg-white text-brand shadow-[0_6px_18px_-8px_rgba(77,11,182,0.45)]">
                <Icon size={18} strokeWidth={1.75} />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-bold tracking-[0.12em] text-brand uppercase">
                  {title}
                </p>
                <p className="mt-0.5 text-xs leading-snug text-ink-soft">{desc}</p>
              </div>
            </div>
            {i < nodes.length - 1 ? (
              <div className="flex justify-center py-1.5 text-brand">
                <ArrowRight size={16} className="rotate-90" />
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <div className="relative mx-auto hidden aspect-square w-full max-w-[440px] sm:block">
        <div className="absolute inset-[18%] rounded-full bg-[radial-gradient(circle,rgba(77,11,182,0.08)_0%,transparent_70%)]" />
        <div className="absolute inset-[28%] rounded-full border border-brand/10" />

        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 h-full w-full"
          aria-hidden
        >
          <defs>
            <marker
              id="os-arrow"
              markerWidth="4"
              markerHeight="4"
              refX="3"
              refY="2"
              orient="auto"
            >
              <path d="M0 0 L4 2 L0 4 Z" fill="#7c3aed" />
            </marker>
          </defs>
          <path
            d="M62 18 A34 34 0 0 1 82 38"
            fill="none"
            stroke="#a78bfa"
            strokeWidth="0.7"
            markerEnd="url(#os-arrow)"
          />
          <path
            d="M82 62 A34 34 0 0 1 62 82"
            fill="none"
            stroke="#a78bfa"
            strokeWidth="0.7"
            markerEnd="url(#os-arrow)"
          />
          <path
            d="M38 82 A34 34 0 0 1 18 62"
            fill="none"
            stroke="#a78bfa"
            strokeWidth="0.7"
            markerEnd="url(#os-arrow)"
          />
          <path
            d="M18 38 A34 34 0 0 1 38 18"
            fill="none"
            stroke="#a78bfa"
            strokeWidth="0.7"
            markerEnd="url(#os-arrow)"
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative flex h-28 w-28 items-center justify-center md:h-32 md:w-32">
            <div className="absolute inset-[-18%] rounded-full bg-[radial-gradient(circle,rgba(236,72,153,0.18)_0%,rgba(59,130,246,0.08)_45%,transparent_70%)] blur-sm" />
            <svg viewBox="0 0 64 64" className="relative h-16 w-16 drop-shadow-md md:h-[4.5rem] md:w-[4.5rem]">
              <defs>
                <linearGradient id="bolt" x1="0.15" y1="0" x2="0.85" y2="1">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="28%" stopColor="#fb923c" />
                  <stop offset="55%" stopColor="#ec4899" />
                  <stop offset="78%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
              <path
                d="M38 4L16 34.5h13.5L24 60l26-34H36.5L38 4z"
                fill="url(#bolt)"
              />
            </svg>
          </div>
        </div>

        {nodes.map(({ title, desc, icon: Icon, x, y }) => (
          <div
            key={title}
            className="absolute w-28 -translate-x-1/2 -translate-y-1/2 text-center md:w-36"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-[#ddd6fe] bg-white text-brand shadow-[0_6px_18px_-8px_rgba(77,11,182,0.45)] md:h-12 md:w-12">
              <Icon size={18} strokeWidth={1.75} />
            </span>
            <p className="mt-2 text-[11px] font-bold tracking-[0.12em] text-brand uppercase md:text-xs">
              {title}
            </p>
            <p className="mt-0.5 text-[10px] leading-snug text-ink-soft md:text-[11px]">{desc}</p>
          </div>
        ))}
      </div>
    </>
  )
}

function LevelsSection() {
  const levels = [
    { icon: Building2, title: 'Enterprise', desc: 'Strengthen across multiple business units and brands.' },
    { icon: LayoutGrid, title: 'Business Unit', desc: 'Build discoverability for a division or category.' },
    { icon: Tag, title: 'Brand', desc: 'Establish and strengthen your brand presence.' },
    { icon: Package, title: 'Product', desc: 'Accelerate discoverability for your product.' },
    { icon: Settings2, title: 'Service', desc: 'Build discoverability for services and customer needs.' },
    { icon: Globe2, title: 'Market', desc: 'Expand into new geographies, segments or opportunities.' },
  ]

  return (
    <section className="px-4 py-12 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <p className="text-center text-[11px] font-bold tracking-[0.14em] text-brand uppercase sm:tracking-[0.18em]">
          ✨ Built around your business objective ✨
        </p>
        <h2 className="mt-3 text-center text-2xl font-extrabold tracking-tight text-balance text-ink sm:text-4xl">
          Every level of your business.
          <br />
          <span className="text-brand">Discoverable by AI.</span>
        </h2>
        <div className="mx-auto mt-4 h-1 w-12 rounded-full bg-brand" />

        <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-4 lg:grid-cols-3 xl:grid-cols-6">
          {levels.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex flex-col items-center rounded-2xl border border-line bg-white px-3 py-5 text-center shadow-sm sm:px-4 sm:py-6"
            >
              <Icon size={28} className="text-brand" strokeWidth={1.5} />
              <h3 className="mt-4 text-base font-bold text-ink">{title}</h3>
              <p className="mt-2 flex-1 text-xs leading-relaxed text-ink-soft">{desc}</p>
              <div className="mt-4 h-0.5 w-8 rounded-full bg-brand" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function LeverageSection() {
  const tiers = [
    {
      icon: BookOpen,
      title: 'Knowledge',
      subtitle: 'Build the capability internally',
      body: [
        'For organisations that want to build AI Discoverability capabilities in-house.',
        'Access the frameworks, intelligence, strategic guidance and knowledge required to build AI Discoverability capabilities in-house.',
      ],
    },
    {
      icon: Network,
      title: 'Technology',
      subtitle: 'Accelerate through technology',
      body: [
        'For organizations with existing teams that want to increase speed, scale and efficiency.',
        'Leverage AI-powered technology for auditing, monitoring, analysis and ongoing measurement.',
      ],
    },
    {
      icon: Headphones,
      title: 'Managed',
      subtitle: 'Engage an expert-led programme',
      body: [
        'For organisations that want an experienced partner to manage the capability.',
        'Blazly can support the strategy, intelligence, implementation, monitoring and continuous optimization of the programme.',
      ],
    },
  ]

  return (
    <section className="px-4 py-12 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <p className="text-center text-[11px] font-bold tracking-[0.14em] text-brand-muted uppercase sm:tracking-[0.2em]">
          Flexible · Scalable · Impactful
        </p>
        <h2 className="mt-3 text-center text-2xl font-extrabold tracking-tight text-balance text-ink sm:text-4xl">
          Three Ways to Leverage <span className="text-brand">AI-DAAS</span>
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm text-ink-soft">
          Different organisations have different levels of internal capability.
        </p>

        <div className="mt-8 grid gap-4 sm:mt-12 sm:gap-5 md:grid-cols-3">
          {tiers.map(({ icon: Icon, title, subtitle, body }) => (
            <article
              key={title}
              className="rounded-2xl bg-[#4d0bb5] p-5 text-white shadow-lg shadow-brand/25 sm:p-7"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40">
                <Icon size={18} />
              </span>
              <h3 className="mt-5 text-lg font-extrabold tracking-wide uppercase">{title}</h3>
              <p className="mt-1 text-sm text-white/90">{subtitle}</p>
              <div className="mt-4 h-px w-10 bg-white/50" />
              {body.map((p) => (
                <p key={p} className="mt-4 text-sm leading-relaxed text-white/85">
                  {p}
                </p>
              ))}
            </article>
          ))}
        </div>

        <div className="mt-10 flex justify-center text-brand">
          <Sparkles size={18} />
        </div>
      </div>
    </section>
  )
}

function FinalCta({ onPrimary }: { onPrimary: () => void }) {
  const steps = [
    { icon: Search, label: 'Discover.' },
    { icon: Brain, label: 'Understand.' },
    { icon: Shield, label: 'Establish.' },
    { icon: TrendingUp, label: 'Evolve.' },
  ]

  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-8 sm:px-8 sm:pb-28 sm:pt-10">
      <div className="pointer-events-none absolute top-0 left-0 hidden h-48 w-40 opacity-50 sm:block wave-dots" />
      <div className="pointer-events-none absolute top-0 right-0 hidden h-48 w-40 opacity-50 sm:block wave-dots" />

      <div className="relative mx-auto max-w-3xl text-center">
        <p className="text-sm text-ink-soft">
          The future of business discovery is already evolving.
        </p>
        <h2 className="mt-3 text-2xl font-extrabold leading-tight tracking-tight text-balance text-ink sm:text-4xl">
          Is your organisation ready to be{' '}
          <span className="text-brand">discovered by AI?</span>
        </h2>

        <div className="mt-7 flex flex-col items-stretch justify-center gap-3 sm:mt-8 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={onPrimary}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-center text-sm leading-snug font-semibold text-white shadow-lg shadow-brand/25 transition hover:bg-brand-bright sm:w-auto sm:px-5 sm:py-3.5"
          >
            <Sparkles size={15} className="shrink-0" />
            <span>Request an AI Discoverability Assessment</span>
            <ArrowRight size={15} className="shrink-0" />
          </button>
          <a
            href="https://www.blazly.ai/"
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-line bg-white px-5 py-3.5 text-sm font-semibold text-brand transition hover:border-brand/30 sm:w-auto"
          >
            Talk to Blazly
            <ArrowRight size={15} className="shrink-0" />
          </a>
        </div>
      </div>

      <div className="mx-auto mt-14 max-w-3xl text-center sm:mt-20">
        <p className="text-[11px] font-bold tracking-[0.16em] text-brand uppercase sm:tracking-[0.2em]">
          — Blazly AI-DAAS —
        </p>
        <h3 className="mt-2 text-xl font-extrabold tracking-tight text-balance text-ink sm:text-3xl">
          AI Discoverability <span className="text-brand">as a Service</span>
        </h3>

        <div className="relative mt-10 grid grid-cols-2 gap-6 sm:mt-12 sm:grid-cols-4 sm:gap-8">
          <div className="pointer-events-none absolute top-5 right-[12%] left-[12%] hidden h-px bg-line sm:block" />
          {steps.map(({ icon: Icon, label }) => (
            <div key={label} className="relative flex flex-col items-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-line bg-white text-brand shadow-sm">
                <Icon size={22} strokeWidth={1.5} />
              </span>
              <p className="mt-3 text-sm font-bold text-ink">{label}</p>
              <div className="mt-2 h-0.5 w-8 bg-brand/40" />
            </div>
          ))}
        </div>

        <p className="mt-10 text-sm text-ink-soft sm:mt-14 sm:text-base pb-[max(0px,env(safe-area-inset-bottom))]">
          You built the business.{' '}
          <span className="font-semibold text-brand">
            We help make its full depth visible to AI.
          </span>
        </p>
      </div>
    </section>
  )
}

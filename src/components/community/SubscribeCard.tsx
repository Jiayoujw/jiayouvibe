import { useState, useCallback, type FormEvent } from 'react'
import { Mail, ArrowRight, CheckCircle, Loader2 } from 'lucide-react'
import { cn } from '@/utils/cn'

interface SubscribeCardProps {
  /**
   * The endpoint to POST the subscription form to.
   * Defaults to a Mailchimp-style action URL.
   *
   * For Mailchimp: use the form action URL from your embedded form
   * (e.g. "https://xxx.us21.list-manage.com/subscribe/post?u=...&id=...").
   *
   * For ConvertKit: use your form's action URL.
   *
   * Leave empty to use a placeholder that simply logs the submission.
   */
  actionUrl?: string
  /** Additional className for the outer wrapper */
  className?: string
}

export default function SubscribeCard({ actionUrl, className }: SubscribeCardProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()
      const trimmed = email.trim()
      if (!trimmed) return

      setStatus('loading')

      // If no real action URL is provided, simulate success after a short delay
      // so users can test the UI. Replace with your real Mailchimp/ConvertKit URL.
      if (!actionUrl) {
        await new Promise((r) => setTimeout(r, 1000))
        setStatus('success')
        setEmail('')
        return
      }

      try {
        // Build a hidden form and submit it so the user lands on the
        // provider's confirmation page in a new tab, or use fetch for a
        // fully inline experience.
        const form = document.createElement('form')
        form.method = 'POST'
        form.action = actionUrl
        form.target = '_blank'
        form.style.display = 'none'

        const emailInput = document.createElement('input')
        emailInput.type = 'hidden'
        emailInput.name = 'EMAIL'
        emailInput.value = trimmed
        form.appendChild(emailInput)

        // Mailchimp anti-bot field (commonly named b_name_value)
        const antiBotName = actionUrl.includes('list-manage')
          ? actionUrl.match(/u=([^&]+)/)?.[1]
          : null
        if (antiBotName) {
          const bInput = document.createElement('input')
          bInput.type = 'hidden'
          bInput.name = `b_${antiBotName}`
          bInput.value = ''
          form.appendChild(bInput)
        }

        document.body.appendChild(form)
        form.submit()
        document.body.removeChild(form)

        setStatus('success')
        setEmail('')
      } catch {
        setStatus('error')
        setTimeout(() => setStatus('idle'), 3000)
      }
    },
    [email, actionUrl],
  )

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl',
        'bg-white/[0.04] backdrop-blur-xl border border-white/[0.08]',
        'p-6 sm:p-8',
        className,
      )}
    >
      {/* Background gradient glow */}
      <div
        className="absolute inset-0 pointer-events-none rounded-2xl"
        style={{
          background:
            'radial-gradient(400px circle at 30% 50%, rgba(6, 182, 212, 0.06), transparent 50%), ' +
            'radial-gradient(400px circle at 70% 50%, rgba(168, 85, 247, 0.05), transparent 50%)',
        }}
      />

      <div className="relative">
        {/* Icon */}
        <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-cyan-400/10 border border-cyan-400/20 mb-5">
          <Mail className="w-5 h-5 text-cyan-400" />
        </div>

        {/* Heading */}
        <h3 className="text-lg font-sora font-bold text-slate-100 mb-2">
          订阅AI周报
        </h3>
        <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-md">
          每周精选AI前沿动态、最新模型发布与开发教程，直接发送到你的邮箱。不推送无关内容，可随时退订。
        </p>

        {/* Form */}
        {status === 'success' ? (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-400/10 border border-emerald-400/20">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-sm text-emerald-300 font-medium">
              订阅成功！感谢你的关注。
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <label htmlFor="subscribe-email" className="sr-only">
              邮箱地址
            </label>
            <input
              id="subscribe-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className={cn(
                'flex-1 min-w-0 px-4 py-2.5 rounded-xl text-sm',
                'bg-white/[0.06] border border-white/[0.10]',
                'text-slate-200 placeholder:text-slate-600',
                'focus:outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20',
                'transition-colors duration-200',
              )}
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className={cn(
                'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl',
                'text-sm font-medium text-slate-900',
                'bg-gradient-to-r from-cyan-400 to-purple-500',
                'hover:from-cyan-300 hover:to-purple-400',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'transition-all duration-200',
                'shadow-lg shadow-purple-500/10',
              )}
            >
              {status === 'loading' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  订阅
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Privacy note */}
        <p className="text-[11px] text-slate-600 mt-4 leading-relaxed">
          我们尊重你的隐私，不会分享你的邮箱地址给第三方。
        </p>
      </div>
    </div>
  )
}

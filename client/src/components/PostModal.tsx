import { useState } from 'react'
import { NeedPost } from '../types'
import { CATEGORY_LABEL, formatCurrency, timeAgo } from '../seed'
import { X, Landmark, Church, MapPin, Phone, ShieldCheck } from 'lucide-react'

interface Props {
  post: NeedPost
  onClose: () => void
  onDonate: (id: string, amount: number) => void
  onRequestContact: (id: string) => void
}

export default function PostModal({ post, onClose, onDonate, onRequestContact }: Props) {
  const [amount, setAmount] = useState('')
  const pct = Math.min(100, Math.round((post.amountRaised / post.amountNeeded) * 100))

  function handleDonate() {
    const n = Number(amount)
    if (!n || n <= 0) return
    onDonate(post.id, n)
    setAmount('')
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-fade-up bg-nightblue border border-brass/20 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[92vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-nightblue border-b border-brass/10 flex items-center justify-between px-6 py-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wide text-sage bg-sage/10 border border-sage/25 px-2.5 py-1 rounded-full">
            {post.congregation === 'mosque' ? <Landmark size={12} /> : <Church size={12} />}
            {post.institutionName}
          </span>
          <button
            onClick={onClose}
            className="text-parchment/50 hover:text-parchment p-1 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brass"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-6 flex flex-col gap-6">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wide text-parchment/35">
              {CATEGORY_LABEL[post.category]} &middot; {timeAgo(post.createdAt)}
            </span>
            <h2 className="font-display text-parchment text-2xl font-semibold leading-snug mt-2">
              {post.title}
            </h2>
            <p className="font-body text-parchment/60 text-sm leading-relaxed mt-3">
              {post.story}
            </p>
          </div>

          <div>
            <div className="flex items-baseline justify-between text-sm font-mono mb-2">
              <span className="text-parchment">
                {formatCurrency(post.amountRaised)}
                <span className="text-parchment/40"> raised of {formatCurrency(post.amountNeeded)}</span>
              </span>
              <span className="text-brass">{pct}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-ink overflow-hidden">
              <div className="h-full rounded-full bg-brass" style={{ width: `${pct}%` }} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono uppercase tracking-wide text-parchment/40">
              Give an amount
            </label>
            <div className="flex gap-2">
              <div className="flex-1 flex items-center bg-ink border border-brass/20 rounded-xl px-4 focus-within:border-brass/60">
                <span className="text-parchment/40 font-mono mr-1">$</span>
                <input
                  type="number"
                  min={1}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="50"
                  className="bg-transparent py-3 w-full text-parchment font-mono focus:outline-none"
                />
              </div>
              <button
                onClick={handleDonate}
                className="bg-brass text-ink font-body font-semibold px-5 rounded-xl hover:bg-brass/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brass"
              >
                Give
              </button>
            </div>
            <p className="text-[11px] text-parchment/35 font-body leading-relaxed">
              This is a demo &mdash; no real payment is processed.
            </p>
          </div>

          <div className="border-t border-brass/10 pt-5">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wide text-parchment/40 mb-3">
              <ShieldCheck size={14} className="text-sage" />
              Verified contact &mdash; general area shown, not a home address
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 bg-ink rounded-xl px-4 py-3">
                <MapPin size={16} className="text-parchment/40 shrink-0" />
                <span className="font-body text-parchment/80 text-sm">
                  {post.contact.neighborhood}, {post.contact.city}
                </span>
              </div>

              <div className="flex items-center gap-3 bg-ink rounded-xl px-4 py-3">
                <Phone size={16} className="text-parchment/40 shrink-0" />
                <span className="font-mono text-parchment/80 text-sm">
                  {post.contact.phone}
                </span>
              </div>

              {!post.contactRevealed ? (
                <button
                  onClick={() => onRequestContact(post.id)}
                  className="text-sm font-body font-medium text-brass hover:text-brass/80 transition-colors text-left"
                >
                  Request full contact number &rarr;
                </button>
              ) : (
                <p className="text-[11px] text-parchment/35 font-body leading-relaxed">
                  Please reach out with care &mdash; this is a real person in a difficult moment.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

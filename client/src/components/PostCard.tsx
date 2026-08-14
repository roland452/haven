import { NeedPost } from '../types'
import { CATEGORY_LABEL, formatCurrency, timeAgo } from '../seed'
import { Landmark, Church } from 'lucide-react'

interface Props {
  post: NeedPost
  onOpen: (id: string) => void
}

const CONGREGATION_STYLE = {
  mosque: {
    icon: Landmark,
    badge: 'text-sage bg-sage/10 border-sage/25',
  },
  church: {
    icon: Church,
    badge: 'text-clay bg-clay/10 border-clay/25',
  },
} as const

export default function PostCard({ post, onOpen }: Props) {
  const pct = Math.min(100, Math.round((post.amountRaised / post.amountNeeded) * 100))
  const fulfilled = pct >= 100
  const { icon: CongregationIcon, badge } = CONGREGATION_STYLE[post.congregation]

  return (
    <button
      onClick={() => onOpen(post.id)}
      className="animate-fade-up text-left bg-nightblue border border-brass/15 rounded-2xl p-6 flex flex-col gap-4 hover:border-brass/40 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brass"
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wide px-2.5 py-1 rounded-full border ${badge}`}
        >
          <CongregationIcon size={12} />
          {post.institutionName}
        </span>
        <span className="text-xs font-mono text-parchment/40">{timeAgo(post.createdAt)}</span>
      </div>

      <div>
        <h3 className="font-display text-parchment text-xl font-medium leading-snug">
          {post.title}
        </h3>
        <p className="font-body text-parchment/50 text-sm mt-2 leading-relaxed line-clamp-3">
          {post.story}
        </p>
      </div>

      <div className="mt-auto pt-2">
        <div className="flex items-baseline justify-between text-sm font-mono mb-2">
          <span className="text-parchment">
            {formatCurrency(post.amountRaised)}
            <span className="text-parchment/40"> / {formatCurrency(post.amountNeeded)}</span>
          </span>
          <span className={fulfilled ? 'text-sage' : 'text-brass'}>{pct}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-ink overflow-hidden">
          <div
            className={`h-full rounded-full ${fulfilled ? 'bg-sage' : 'bg-brass'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wide text-parchment/35">
              {CATEGORY_LABEL[post.category]}
            </span>
            <span className="text-parchment/15">&middot;</span>
            <span className="text-[11px] font-mono uppercase tracking-wide text-sage">
              Institution
            </span>
          </div>
          {fulfilled && (
            <span className="text-[11px] font-mono uppercase tracking-wide text-sage">
              Fulfilled
            </span>
          )}
        </div>
      </div>
    </button>
  )
}

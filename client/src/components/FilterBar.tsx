import { Congregation, NeedCategory } from '../types'
import { CATEGORY_LABEL } from '../seed'

interface Props {
  congregation: Congregation | 'all'
  setCongregation: (v: Congregation | 'all') => void
  category: NeedCategory | 'all'
  setCategory: (v: NeedCategory | 'all') => void
}

const CATEGORIES: (NeedCategory | 'all')[] = [
  'all',
  'medical',
  'housing',
  'food',
  'utilities',
  'education',
  'other',
]

export default function FilterBar({ congregation, setCongregation, category, setCategory }: Props) {
  return (
    <div className="max-w-5xl mx-auto px-6 py-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
      <div className="flex bg-nightblue rounded-full p-1 border border-brass/15 w-fit">
        {(['all', 'mosque', 'church'] as const).map((c) => (
          <button
            key={c}
            onClick={() => setCongregation(c)}
            className={`px-4 py-1.5 rounded-full text-sm font-body capitalize transition-colors ${
              congregation === c
                ? 'bg-brass text-ink font-semibold'
                : 'text-parchment/60 hover:text-parchment'
            }`}
          >
            {c === 'all' ? 'All' : c}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 overflow-x-auto">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-3 py-1.5 rounded-full text-xs font-mono border transition-colors whitespace-nowrap ${
              category === c
                ? 'border-brass text-brass bg-brass/10'
                : 'border-parchment/15 text-parchment/50 hover:border-parchment/30 hover:text-parchment/80'
            }`}
          >
            {c === 'all' ? 'All categories' : CATEGORY_LABEL[c]}
          </button>
        ))}
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Congregation, DraftNeedPost, NeedCategory } from '../types'
import { X } from 'lucide-react'

interface Props {
  onClose: () => void
  onCreate: (draft: DraftNeedPost) => void
}

const CATEGORY_OPTIONS: NeedCategory[] = [
  'medical',
  'housing',
  'food',
  'utilities',
  'education',
  'other',
]

const EMPTY: DraftNeedPost = {
  title: '',
  story: '',
  category: 'other',
  congregation: 'mosque',
  institutionName: '',
  amountNeeded: 0,
  phone: '',
  neighborhood: '',
  city: '',
}

export default function CreatePostModal({ onClose, onCreate }: Props) {
  const [draft, setDraft] = useState<DraftNeedPost>(EMPTY)
  const [error, setError] = useState('')

  function update<K extends keyof DraftNeedPost>(key: K, value: DraftNeedPost[K]) {
    setDraft((d) => ({ ...d, [key]: value }))
  }

  function submit() {
    if (!draft.title || !draft.story || !draft.institutionName || !draft.amountNeeded || !draft.phone || !draft.neighborhood || !draft.city) {
      setError('Please fill in every field so the community can trust and verify this need.')
      return
    }
    onCreate(draft)
  }

  const inputCls =
    'w-full bg-ink border border-brass/20 rounded-xl px-4 py-3 text-parchment font-body placeholder:text-parchment/25 focus:outline-none focus:border-brass/60'

  return (
    <div className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6">
      <div className="animate-fade-up bg-nightblue border border-brass/20 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 bg-nightblue border-b border-brass/10 flex items-center justify-between px-6 py-4">
          <h2 className="font-display text-parchment text-lg font-semibold">Share a need</h2>
          <button
            onClick={onClose}
            className="text-parchment/50 hover:text-parchment p-1 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brass"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-6 flex flex-col gap-4">
          <p className="text-xs text-parchment/40 font-body leading-relaxed -mt-1">
            Only share a general neighborhood, never a street address. Listings here should
            be posted with the knowledge of the person you're describing.
          </p>

          <div className="flex bg-ink rounded-full p-1 w-fit">
            {(['mosque', 'church'] as Congregation[]).map((c) => (
              <button
                key={c}
                onClick={() => update('congregation', c)}
                className={`px-4 py-1.5 rounded-full text-sm font-body capitalize transition-colors ${
                  draft.congregation === c ? 'bg-brass text-ink font-semibold' : 'text-parchment/50'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <input
            className={inputCls}
            placeholder="Institution name (e.g. Al-Noor Community Masjid)"
            value={draft.institutionName}
            onChange={(e) => update('institutionName', e.target.value)}
          />

          <input
            className={inputCls}
            placeholder="Short title (e.g. Rent shortfall after job loss)"
            value={draft.title}
            onChange={(e) => update('title', e.target.value)}
          />

          <textarea
            className={`${inputCls} min-h-28 resize-none`}
            placeholder="Tell the story with care and dignity"
            value={draft.story}
            onChange={(e) => update('story', e.target.value)}
          />

          <select
            className={inputCls}
            value={draft.category}
            onChange={(e) => update('category', e.target.value as NeedCategory)}
          >
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c} className="bg-nightblue">
                {c[0].toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>

          <input
            type="number"
            min={1}
            className={inputCls}
            placeholder="Amount needed ($)"
            value={draft.amountNeeded || ''}
            onChange={(e) => update('amountNeeded', Number(e.target.value))}
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              className={inputCls}
              placeholder="Neighborhood"
              value={draft.neighborhood}
              onChange={(e) => update('neighborhood', e.target.value)}
            />
            <input
              className={inputCls}
              placeholder="City, state"
              value={draft.city}
              onChange={(e) => update('city', e.target.value)}
            />
          </div>

          <input
            className={inputCls}
            placeholder="Contact phone (kept partially masked publicly)"
            value={draft.phone}
            onChange={(e) => update('phone', e.target.value)}
          />

          {error && <p className="text-sm text-clay font-body">{error}</p>}

          <button
            onClick={submit}
            className="bg-brass text-ink font-body font-semibold py-3 rounded-xl hover:bg-brass/90 transition-colors mt-2"
          >
            Post to the community
          </button>
        </div>
      </div>
    </div>
  )
}

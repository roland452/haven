import { Plus, HandHeart, LogOut, User as UserIcon } from 'lucide-react'
import { PublicUser } from '../types'

interface Props {
  onGiveStory: () => void
  totalRaised: number
  activeCount: number
  currentUser: PublicUser | null
  onSignIn: () => void
  onSignOut: () => void
}

export default function Header({
  onGiveStory,
  totalRaised,
  activeCount,
  currentUser,
  onSignIn,
  onSignOut,
}: Props) {
  return (
    <header className="relative overflow-hidden border-b border-brass/15 bg-lattice bg-nightblue">
      <div className="max-w-5xl mx-auto px-6 pt-14 pb-12 sm:pt-20 sm:pb-16">
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2 text-brass/80 text-sm tracking-[0.2em] uppercase font-mono">
            <HandHeart size={16} strokeWidth={1.75} />
            <span>Mosque &amp; church aid network</span>
          </div>

          {currentUser ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:flex items-center gap-1.5 text-parchment/60 text-sm font-body">
                <UserIcon size={14} />
                {currentUser.name}
                <span className="text-parchment/30 font-mono text-xs capitalize">
                  &middot; {currentUser.role}
                </span>
              </span>
              <button
                onClick={onSignOut}
                className="flex items-center gap-1.5 text-parchment/50 hover:text-parchment text-sm font-body transition-colors"
              >
                <LogOut size={14} />
                Sign out 
              </button>
            </div>
          ) : (
            <button
              onClick={onSignIn}
              className="text-parchment/70 hover:text-parchment text-sm font-body font-medium transition-colors"
            >
              Sign in
            </button>
          )}
        </div>

        <h1 className="font-display text-parchment text-4xl sm:text-6xl leading-[1.05] font-semibold max-w-3xl">
          Neighbors carrying neighbors
          <span className="text-brass">.</span>
        </h1>

        <p className="font-body text-parchment/60 text-base sm:text-lg mt-5 max-w-xl leading-relaxed">
          Verified need, spoken plainly. Every listing here comes through a mosque
          or church that knows the person asking. You give directly &mdash; no
          platform cut, no middleman.
        </p>

        <div className="flex flex-wrap items-center gap-4 mt-8">
          <button
            onClick={onGiveStory}
            className="group inline-flex items-center gap-2 bg-brass text-ink font-body font-semibold px-6 py-3 rounded-full hover:bg-brass/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-nightblue"
          >
            <Plus size={18} strokeWidth={2.25} />
            Share a need
          </button>

          <div className="flex items-center gap-6 text-parchment/70 font-mono text-sm">
            <div>
              <span className="text-parchment text-lg font-medium">{activeCount}</span> open requests
            </div>
            <div className="w-px h-4 bg-parchment/20" />
            <div>
              <span className="text-parchment text-lg font-medium">
                ${totalRaised.toLocaleString()}
              </span>{' '}
              given so far
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

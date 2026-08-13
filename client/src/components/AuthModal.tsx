import { useState } from 'react'
import { X, LogIn, UserPlus } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { UserRole } from '../types'

interface Props {
  onClose: () => void
  onSuccess: () => void
}

export default function AuthModal({ onClose, onSuccess }: Props) {
  const { signup, login } = useAuth()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<UserRole>('donor')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const inputCls =
    'w-full bg-ink border border-brass/20 rounded-xl px-4 py-3 text-parchment font-body placeholder:text-parchment/25 focus:outline-none focus:border-brass/60'

  async function submit() {
    setBusy(true)
    setError('')
    const result =
      mode === 'login' ? await login(email, password) : await signup(name, email, password, role)
    setBusy(false)
    if (result) {
      setError(result)
    } else {
      onSuccess()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-fade-up bg-nightblue border border-brass/20 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-sm"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-brass/10">
          <h2 className="font-display text-parchment text-lg font-semibold flex items-center gap-2">
            {mode === 'login' ? <LogIn size={18} className="text-brass" /> : <UserPlus size={18} className="text-brass" />}
            {mode === 'login' ? 'Sign in' : 'Create an account'}
          </h2>
          <button
            onClick={onClose}
            className="text-parchment/50 hover:text-parchment p-1 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brass"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-6 flex flex-col gap-4">
          {mode === 'signup' && (
            <>
              <input
                className={inputCls}
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <div className="flex bg-ink rounded-full p-1 w-fit">
                {(['donor', 'institution'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`px-4 py-1.5 rounded-full text-sm font-body capitalize transition-colors ${
                      role === r ? 'bg-brass text-ink font-semibold' : 'text-parchment/50'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </>
          )}

          <input
            className={inputCls}
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className={inputCls}
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
          />

          {error && <p className="text-sm text-clay font-body">{error}</p>}

          <button
            onClick={submit}
            disabled={busy}
            className="bg-brass text-ink font-body font-semibold py-3 rounded-xl hover:bg-brass/90 transition-colors disabled:opacity-50"
          >
            {busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>

          <button
            onClick={() => {
              setMode(mode === 'login' ? 'signup' : 'login')
              setError('')
            }}
            className="text-sm font-body text-parchment/50 hover:text-parchment/80 transition-colors"
          >
            {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>

          <p className="text-[11px] text-parchment/30 font-body leading-relaxed border-t border-brass/10 pt-4">
            Demo auth: passwords are hashed with SHA-256 and stored only in this browser's
            localStorage. Not real security — don't reuse a real password here.
          </p>
        </div>
      </div>
    </div>
  )
}

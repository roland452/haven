import { useEffect, useState } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { apiCreatePost, apiDonate, apiFetchPosts, apiRequestContact } from './lib/api'
import { Congregation, DraftNeedPost, NeedCategory, NeedPost } from './types'
import Header from './components/Header'
import FilterBar from './components/FilterBar'
import PostCard from './components/PostCard'
import PostModal from './components/PostModal'
import CreatePostModal from './components/CreatePostModal'
import AuthModal from './components/AuthModal'

function AppInner() {
  const { currentUser, authLoading, logout } = useAuth()

  const [posts, setPosts] = useState<NeedPost[]>([])
  const [loadingPosts, setLoadingPosts] = useState(true)

  const [congregation, setCongregation] = useState<Congregation | 'all'>('all')
  const [category, setCategory] = useState<NeedCategory | 'all'>('all')
  const [openId, setOpenId] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  // Remembers what the user was trying to do so we can resume it right after sign-in.
  const [pendingAction, setPendingAction] = useState<null | (() => void)>(null)

  // Filtering now happens server-side, so re-fetch whenever the filters change.
  useEffect(() => {
    let cancelled = false
    setLoadingPosts(true)
    apiFetchPosts(congregation, category)
      .then((data) => {
        if (!cancelled) setPosts(data)
      })
      .finally(() => {
        if (!cancelled) setLoadingPosts(false)
      })
    return () => {
      cancelled = true
    }
  }, [congregation, category])

  const totalRaised = posts.reduce((sum, p) => sum + p.amountRaised, 0)
  const activeCount = posts.filter((p) => p.amountRaised < p.amountNeeded).length
  const openPost = posts.find((p) => p.id === openId) || null

  function requireAuth(action: () => void) {
    if (currentUser) {
      action()
    } else {
      setPendingAction(() => action)
      setShowAuth(true)
    }
  }

  function handleAuthSuccess() {
    setShowAuth(false)
    if (pendingAction) {
      pendingAction()
      setPendingAction(null)
    }
  }

  function handleDonate(id: string, amount: number) {
    requireAuth(() => {
      apiDonate(id, amount).then((updated) => {
        setPosts((prev) => prev.map((p) => (p.id === id ? updated : p)))
      })
    })
  }

  function handleRequestContact(id: string) {
    requireAuth(() => {
      apiRequestContact(id).then((updated) => {
        setPosts((prev) => prev.map((p) => (p.id === id ? updated : p)))
      })
    })
  }

  function handleCreate(draft: DraftNeedPost) {
    if (!currentUser) return
    apiCreatePost(draft).then((created) => {
      setPosts((prev) => [created, ...prev])
      setShowCreate(false)
    })
  }

  return (
    <div className="min-h-screen bg-ink">
      <Header
        onGiveStory={() => requireAuth(() => setShowCreate(true))}
        totalRaised={totalRaised}
        activeCount={activeCount}
        currentUser={currentUser}
        onSignIn={() => setShowAuth(true)}
        onSignOut={logout}
      />

      <FilterBar
        congregation={congregation}
        setCongregation={setCongregation}
        category={category}
        setCategory={setCategory}
      />

      <main className="max-w-5xl mx-auto px-6 pb-24">
        {authLoading || loadingPosts ? (
          <div className="text-center py-24">
            <p className="font-display text-parchment/50 text-xl">Loading requests&hellip;</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-display text-parchment/50 text-xl">No requests match yet.</p>
            <p className="font-body text-parchment/30 text-sm mt-2">
              Try a different filter, or be the first to share a need here.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-5 mt-2">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} onOpen={setOpenId} />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-brass/10 py-8">
        <p className="text-center text-xs text-parchment/25 font-mono">
          Haven &middot; a community aid network
        </p>
      </footer>

      {openPost && (
        <PostModal
          post={openPost}
          onClose={() => setOpenId(null)}
          onDonate={handleDonate}
          onRequestContact={handleRequestContact}
        />
      )}

      {showCreate && (
        <CreatePostModal onClose={() => setShowCreate(false)} onCreate={handleCreate} />
      )}

      {showAuth && (
        <AuthModal
          onClose={() => {
            setShowAuth(false)
            setPendingAction(null)
          }}
          onSuccess={handleAuthSuccess}
        />
      )}
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  )
}

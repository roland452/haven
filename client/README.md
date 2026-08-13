# Haven — Community Aid

A demo platform where verified needs from mosque and church communities are
posted publicly, and donors can give and get in touch directly. Built as a
school project: **React + TypeScript + Tailwind CSS only**, no backend —
everything persists in the browser's `localStorage`.

## Stack

- [Vite](https://vitejs.dev/) — build tool & dev server
- React 18 + TypeScript
- Tailwind CSS
- [lucide-react](https://lucide.dev/) — icons
- Browser `crypto.subtle` (Web Crypto API) — password hashing
- `localStorage` — all persistence (posts, users, session)

No other libraries, no server, no database.

## Getting started

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

To type-check and build a production bundle:

```bash
npm run build
```

## Features

- **Feed** of need posts, filterable by congregation (mosque / church) and
  category (medical, housing, food, utilities, education, other)
- **Post detail view** with a progress bar, a simulated donation flow, and a
  contact section that shows a general neighborhood (never a street address)
  and a partially masked phone number until a contact request is made
- **Create-a-need form** for posting a new listing
- **Authentication** — sign up / sign in / sign out, with a `donor` or
  `institution` role chosen at signup. Giving, requesting contact info, and
  posting a need are all gated behind being signed in

## How data is stored

Everything lives under a few `localStorage` keys:

| Key                       | Contents                                   |
| -------------------------- | ------------------------------------------- |
| `haven.posts`              | All need posts (seeded + user-created)      |
| `haven.users`               | Registered accounts (name, email, password hash, role) |
| `haven.session`             | The currently signed-in user's id           |
| `haven.revealedContacts`   | Which post contacts the current browser has unlocked |

## Security notes (read before treating this as real)

This is intentionally a **classroom-grade** implementation, not a production
one:

- Passwords are hashed with SHA-256 before storage, but with **no salt** and
  no server-side verification — the "backend" is just `localStorage` in your
  own browser. Anyone with dev tools open can read every user and post
  directly.
- There's no real payment processing. The "Give" button just increments a
  number.
- Contact details show a neighborhood and masked phone number by design,
  not a full address — worth keeping even if you extend this, since posting
  people's real home addresses publicly is a genuine safety risk in a real
  version of an app like this.

If you extend this beyond a demo, the things to add first are a real backend
with server-side auth, a proper database, and actual verification that a
listing was posted with the knowledge and consent of the person it describes.

## Project structure

```
src/
  components/       UI components (Header, FilterBar, PostCard, modals)
  contexts/         AuthContext (signup/login/logout)
  hooks/            useLocalStorage, password hashing helper
  types.ts          Shared TypeScript types
  seed.ts           Seed data + formatting helpers
  App.tsx           Top-level app state and layout
  main.tsx          React entry point
```

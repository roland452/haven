import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../model/user.js'
import userAuth from '../controller/userAuth.js'

const router = express.Router()

// How long a login lasts before the user has to sign in again.
// Change this one value (e.g. '2h') if you want a shorter session.
const TOKEN_TTL = '7d'
const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000 // keep in sync with TOKEN_TTL above

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax',
  // Only mark the cookie "secure" when you're actually serving over HTTPS.
  // If NODE_ENV ends up set to "production" while still running on plain
  // http (e.g. locally), the browser silently drops the cookie on every
  // response — which looks exactly like being logged out on every donate/
  // create-post click, since those requests have no cookie to prove who
  // you are. Set COOKIE_SECURE=true explicitly once you deploy behind HTTPS.
  secure: 'false',
  maxAge: TOKEN_TTL_MS,
}

function signToken(user) {
  return jwt.sign(
    { id: user._id.toString(), name: user.name, email: user.email, role: user.role },
    process.env.USER_JWT_SECRET,
    { expiresIn: TOKEN_TTL }
  )
}

function toPublic(user) {
  return { id: user._id, name: user.name, email: user.email, role: user.role }
}

// POST /api/auth/signup
router.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    if (!name?.trim() || !email?.trim() || !password || password.length < 6) {
      return res
        .status(400)
        .json({ message: 'Please fill in every field. Passwords need at least 6 characters.' })
    }
    if (!['donor', 'institution'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role.' })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const existing = await User.findOne({ email: normalizedEmail })
    if (existing) {
      return res
        .status(409)
        .json({ message: 'An account with that email already exists — try signing in instead.' })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role,
    })

    const token = signToken(user)
    res.cookie('userToken', token, COOKIE_OPTIONS)
    res.status(201).json({ user: toPublic(user) })
  } catch (error) {
    res.status(500).json({ message: 'Could not create account.' })
  }
})

// POST /api/auth/login
router.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email?.trim() || !password) {
      return res.status(400).json({ message: 'Please enter your email and password.' })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const user = await User.findOne({ email: normalizedEmail })
    if (!user) {
      return res.status(404).json({ message: 'No account found with that email.' })
    }

    const match = await bcrypt.compare(password, user.passwordHash)
    if (!match) {
      return res.status(401).json({ message: 'Incorrect password.' })
    }

    const token = signToken(user)
    res.cookie('userToken', token, COOKIE_OPTIONS)
    res.status(200).json({ user: toPublic(user) })
  } catch (error) {
    res.status(500).json({ message: 'Could not log in.' })
  }
})

// POST /api/auth/logout
router.post('/api/logout', (req, res) => {
  res.clearCookie('userToken', COOKIE_OPTIONS)
  res.status(200).json({ message: 'Logged out.' })
})

// GET /api/auth/me
router.get('/api/me', userAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ authenticated: false })
    res.status(200).json({ user: toPublic(user) })
  } catch (error) {
    res.status(500).json({ authenticated: false })
  }
})

export default router


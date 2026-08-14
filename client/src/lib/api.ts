import axios from 'axios'
import {
  Congregation,
  DraftNeedPost,
  NeedCategory,
  NeedPost,
  PublicUser,
  UserRole,
} from '../types'

const API_URL = 'https://haven-2gdm.onrender.com/api'
// Point this at your server, e.g. VITE_API_URL=http://localhost:5000/api in .env
export const api = axios.create({
  baseURL: API_URL || 'http://localhost:5000/api',
  withCredentials: true, // required so the userToken cookie is sent/received
})

function errorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error) && error.response?.data?.message) {
    return error.response.data.message
  }
  return fallback
}

// ---------------- auth ----------------

export async function apiSignup(
  name: string,
  email: string,
  password: string,
  role: UserRole, 
  founder: string,
  desc: string
): Promise<{ user?: PublicUser; error?: string }> {
  try {
    const { data } = await api.post('/signup', { name, email, password, role, founder, desc })
    return { user: data.user }
  } catch (error) {
    return { error: errorMessage(error, 'Could not create account.') }
  }
}

export async function apiLogin(
  email: string,
  password: string
): Promise<{ user?: PublicUser; error?: string }> {
  try {
    const { data } = await api.post('/login', { email, password })
    return { user: data.user }
  } catch (error) {
    return { error: errorMessage(error, 'Could not log in.') }
  }
}

export async function apiLogout(): Promise<void> {
  try {
    await api.post('/logout')
  } catch {
    // logging out client-side regardless is fine even if the request fails
  }
}

export async function apiMe(): Promise<PublicUser | null> {
  try {
    const { data } = await api.get('/me')
    return data.user
  } catch {
    return null
  }
}

// ---------------- posts ----------------

export async function apiFetchPosts(
  congregation: Congregation | 'all',
  category: NeedCategory | 'all'
): Promise<NeedPost[]> {
  const { data } = await api.get('/', { params: { congregation, category } })
  return data.posts
}

export async function apiCreatePost(draft: DraftNeedPost): Promise<NeedPost> {
  const { data } = await api.post('/posts', draft)
  return data.post
}

export async function apiDonate(id: string, amount: number): Promise<NeedPost> {
  const { data } = await api.post(`/posts/${id}/donate`, { amount })
  return data.post
}

export async function apiRequestContact(id: string): Promise<NeedPost> {
  const { data } = await api.post(`/posts/${id}/contact-request`)
  return data.post
}

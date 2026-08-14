import { NeedPost } from './types'

export const CATEGORY_LABEL: Record<string, string> = {
  medical: 'Medical care',
  housing: 'Housing & rent',
  food: 'Food & essentials',
  utilities: 'Utilities',
  education: 'Education',
  other: 'General need',
}

export function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n)
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / 86_400_000)
  if (days <= 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 30) return `${days} days ago`
  const months = Math.floor(days / 30)
  return `${months} month${months > 1 ? 's' : ''} ago`

}



import { NeedPost } from './types'

export const CATEGORY_LABEL: Record<string, string> = {
  medical: 'Medical care',
  housing: 'Housing & rent',
  food: 'Food & essentials',
  utilities: 'Utilities',
  education: 'Education',
  other: 'General need',
}

export function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length < 4) return '••••'
  return `••• ••• ${digits.slice(-4)}`
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

export const SEED_POSTS: NeedPost[] = [
  {
    id: 'p1',
    title: 'Winter rent shortfall after job loss',
    story:
      'Brother Musa lost his warehouse job in October and has fallen two months behind on rent for the room where he and his daughter live. He is working part-time shifts while searching for steady work and needs help covering the gap before the landlord files eviction notice.',
    category: 'housing',
    congregation: 'mosque',
    institutionName: 'Al-Noor Community Masjid',
    amountNeeded: 1400,
    amountRaised: 620,
    contact: { phone: '+1 555 019 2214', neighborhood: 'Fruitvale', city: 'Oakland, CA' },
    createdAt: new Date(Date.now() - 3 * 86_400_000).toISOString(),
    contactRequests: 4,
    postedBy: 'seed-institution-1',
  },
  {
    id: 'p2',
    title: 'Insulin costs after insurance lapse',
    story:
      'Sister Adaeze is between jobs and lost her health coverage last month. She is Type 1 diabetic and needs help bridging the cost of insulin and supplies until her new employer\u2019s plan begins in six weeks.',
    category: 'medical',
    congregation: 'church',
    institutionName: 'Grace Fellowship Church',
    amountNeeded: 600,
    amountRaised: 310,
    contact: { phone: '+1 555 044 7781', neighborhood: 'Hyde Park', city: 'Chicago, IL' },
    createdAt: new Date(Date.now() - 8 * 86_400_000).toISOString(),
    contactRequests: 9,
    postedBy: 'seed-institution-2',
  },
  {
    id: 'p3',
    title: 'Groceries for family of five, single income',
    story:
      'The Osei family\u2019s sole earner had hours cut at the plant this quarter. Weekly grocery help through the pantry has been running short by mid-week. Any support toward a stocked pantry would carry them through the month.',
    category: 'food',
    congregation: 'church',
    institutionName: 'St. Matthew\u2019s Parish',
    amountNeeded: 350,
    amountRaised: 350,
    contact: { phone: '+1 555 067 3390', neighborhood: 'Overtown', city: 'Miami, FL' },
    createdAt: new Date(Date.now() - 14 * 86_400_000).toISOString(),
    contactRequests: 12,
    postedBy: 'seed-institution-2',
  },
  {
    id: 'p4',
    title: 'Winter heating bill, elderly widow',
    story:
      'Hajjah Fatima, 74, lives alone and is behind on her gas bill after a costly furnace repair. The utility has issued a shutoff warning. Community elders are helping coordinate but the balance remains short.',
    category: 'utilities',
    congregation: 'mosque',
    institutionName: 'Bayside Islamic Center',
    amountNeeded: 480,
    amountRaised: 90,
    contact: { phone: '+1 555 083 5567', neighborhood: 'Dorchester', city: 'Boston, MA' },
    createdAt: new Date(Date.now() - 1 * 86_400_000).toISOString(),
    contactRequests: 2,
    postedBy: 'seed-institution-1',
  },
]

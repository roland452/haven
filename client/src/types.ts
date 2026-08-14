export type Congregation = 'mosque' | 'church'

export type NeedCategory =
  | 'medical'
  | 'housing'
  | 'food'
  | 'utilities'
  | 'education'
  | 'other'

export interface ContactInfo {
  /** Masked by the server unless the viewer has requested it for this post. */
  phone: string
  /** General area only — never a street address. */
  neighborhood: string
  city: string
}

export interface NeedPost {
  id: string
  title: string
  story: string
  category: NeedCategory
  congregation: Congregation
  institutionName: string
  amountNeeded: number
  amountRaised: number
  contact: ContactInfo
  createdAt: string
  contactRequests: number
  /** Whether the current viewer has already been sent the full phone number. */
  contactRevealed: boolean
  postedBy: string
}

export type UserRole = 'donor' | 'institution'

export interface PublicUser {
  id: string
  name: string
  email: string
  role: UserRole
  founder?: string,
  desc?: string
}

export interface DraftNeedPost {
  title: string
  story: string
  category: NeedCategory
  congregation: Congregation
  institutionName: string
  amountNeeded: number
  phone: string
  neighborhood: string
  city: string
}

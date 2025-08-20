export interface PricePlan {
  name: string
  price: number
  currency: string
  period: string
  features: string[]
  is_popular: boolean
}

export interface MarketplaceListing {
  name: string
  listing_url: string
  upvotes?: number
  reviews_count?: number
  rating?: number
  price_plans: PricePlan[]
  raw_data?: Record<string, any>
}

export interface TrafficInfo {
  visits_month?: number
  visits_growth?: number
  bounce_rate?: number
  avg_time_on_site?: number
  traffic_sources?: string
}

export interface MrrEstimate {
  mrr_low: number
  mrr_likely: number
  mrr_high: number
  confidence: number
  assumptions: string[]
  methodology: string
}

export interface Product {
  id: number
  name: string
  canonical_url: string
  description?: string
  logo_url?: string
  categories: string[]
  tags: string[]
  marketplaces: MarketplaceListing[]
  estimates?: MrrEstimate
  traffic?: TrafficInfo
  created_at: string
  updated_at: string
}

export interface ProductListResponse {
  products: Product[]
  total: number
  page: number
  per_page: number
}
import type { EnumContract } from "./enums"

export interface TypeSearch {
  search: string
  location: string
  contracts: string[]
}

export interface ApiSearchResult {
  jobs: TypeJob[]
  nbTotalJobs: number
  success: boolean
  error: string
}

export interface SearchResult {
  jobs: TypeJob[]
  nbTotalJobs: number
  status: 'idle' | 'loading' | 'success' | 'error'
}

export interface TypeJob {
  link: string
  title: string
  company: string
  contractType: EnumContract
  location: string
  timeSincePosted: string
  img?: string
}

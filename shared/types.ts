import type { AsyncDataRequestStatus } from "nuxt/app"
import type { EnumContract } from "./enums"

export interface TypeSearch {
  search: string
  location: string
  contracts: string[]
}

export interface SearchResult {
  status: AsyncDataRequestStatus
  jobs: TypeJob[] | undefined
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

export interface TypeError {
  error: string
}
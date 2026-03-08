import type { AsyncDataRequestStatus } from "nuxt/app"
import type { EnumContract } from "./enums"

export interface TypeSearch {
  search: string
  location: string
  contracts: string[]
}

export interface ApiResponse {
  jobs: TypeJob[]
  nbJobs: number
}

export interface TypeCursor {
  //lastCreatedAt: string
  lastId: number
}

export interface SearchResult {
  status: AsyncDataRequestStatus
  jobs: TypeJob[] | undefined
  nbTotalJobs: number
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
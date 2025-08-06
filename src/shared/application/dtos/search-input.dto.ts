import { SortDirection } from '@/shared/domain/repositories/searchable-repository-contracts'

export type SearchInputDTO<Filter = string> = {
  page?: number
  perPage?: number
  sort?: string
  sortDirection?: SortDirection | null
  filter?: Filter | null
}

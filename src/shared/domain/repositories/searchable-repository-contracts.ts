import { Entity } from '../entities/entity'
import { RepositoryInterface } from './repository-contracts'

export type SortDirection = 'asc' | 'desc'
export type SearchProps<Filter = string> = {
  page?: number
  perPage?: number
  sort?: string
  sortDirection?: SortDirection | null
  filter?: Filter | null
}

export class SearchParams {
  protected _page: number
  protected _perPage: number
  protected _sort: string | null
  protected _sortDirection: SortDirection | null
  protected _filter: string | null

  constructor(props: SearchProps) {
    this._page = props.page ?? 1
    this._perPage = props.perPage ?? 15
    this._sort = props.sort ?? null
    this._sortDirection = props.sortDirection ?? null
    this._filter = props.filter ?? null
  }

  get page(): number {
    return this._page
  }

  private set page(value: number) {}

  get perPage(): number {
    return this._perPage
  }

  private set perPage(value: number) {}

  get sort(): string | null {
    return this._sort
  }

  private set sort(value: string | null) {
    this._sort = value
  }

  get sortDirection(): SortDirection | null {
    return this._sortDirection
  }

  private set sortDirection(value: SortDirection | null) {
    this._sortDirection = value
  }

  get filter(): string | null {
    return this._filter
  }

  private set filter(value: string | null) {
    this._filter = value
  }
}

export interface SearchableRepositoryInterface<
  E extends Entity,
  SearchInput,
  SearchOutput,
> extends RepositoryInterface<E> {
  search(input: SearchInput): Promise<SearchOutput>
}

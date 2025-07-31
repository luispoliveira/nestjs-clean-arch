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

  constructor(props: SearchProps = {}) {
    this.page = props.page ?? 1
    this.perPage = props.perPage ?? 15
    this.sort = props.sort ?? null
    this.sortDirection = props.sortDirection ?? null
    this.filter = props.filter ?? null
  }

  get page(): number {
    return this._page
  }

  private set page(value: number) {
    let _page = value === (true as any) ? 1 : +value

    if (
      isNaN(_page) ||
      _page <= 0 ||
      parseInt(_page.toString(), 10) !== _page
    ) {
      _page = 1
    }
    this._page = _page
  }

  get perPage(): number {
    return this._perPage
  }

  private set perPage(value: number) {
    let _perPage = value === (true as any) ? 15 : +value
    if (
      isNaN(_perPage) ||
      _perPage <= 0 ||
      parseInt(_perPage.toString(), 10) !== _perPage
    ) {
      _perPage = 15
    }
    this._perPage = _perPage
  }

  get sort(): string | null {
    return this._sort
  }

  private set sort(value: string | null) {
    this._sort =
      value === null ||
      value === undefined ||
      value === (true as any) ||
      value === ''
        ? null
        : `${value}`
  }

  get sortDirection(): SortDirection | null {
    return this._sortDirection
  }

  private set sortDirection(value: SortDirection | null) {
    if (!this.sort) {
      this._sortDirection = null
      return
    }
    const dir = `${value}`.toLowerCase()
    this._sortDirection =
      dir !== 'asc' && dir !== 'desc' ? 'desc' : (dir as SortDirection)
  }

  get filter(): string | null {
    return this._filter
  }

  private set filter(value: string | null) {
    this._filter =
      value === null || value === undefined || value === (true as any)
        ? null
        : `${value}`
  }
}

export interface SearchableRepositoryInterface<
  E extends Entity,
  SearchInput,
  SearchOutput,
> extends RepositoryInterface<E> {
  search(input: SearchParams): Promise<SearchOutput>
}

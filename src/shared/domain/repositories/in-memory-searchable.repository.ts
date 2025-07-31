import { Entity } from '../entities/entity'
import { InMemoryRepository } from './in-memory.repository'
import {
  SearchableRepositoryInterface,
  SearchParams,
  SearchResult,
  SortDirection,
} from './searchable-repository-contracts'

export abstract class InMemorySearchableRepository<E extends Entity>
  extends InMemoryRepository<E>
  implements SearchableRepositoryInterface<E, any, any>
{
  async search(input: SearchParams): Promise<SearchResult<E>> {
    const items = await this.findAll()
    const filteredItems = await this.applyFilter(items, input.filter)
    const sortedItems = await this.applySort(
      filteredItems,
      input.sort,
      input.sortDirection,
    )
    const paginatedItems = await this.applyPaginate(
      sortedItems,
      input.page,
      input.perPage,
    )

    return new SearchResult<E>({
      items: paginatedItems,
      total: filteredItems.length,
      currentPage: input.page,
      perPage: input.perPage,
      sort: input.sort,
      sortDirection: input.sortDirection,
      filter: input.filter,
    })
  }

  protected abstract applyFilter(
    items: E[],
    filter: string | null,
  ): Promise<E[]>

  protected async applySort(
    items: E[],
    sort: string | null,
    sortDirection: SortDirection | null,
  ): Promise<E[]> {}

  protected async applyPaginate(
    items: E[],
    page: SearchParams['page'],
    perPage: SearchParams['perPage'],
  ): Promise<E[]> {
    const start = (page - 1) * perPage
    const end = start + perPage
    return items.slice(start, end)
  }
}

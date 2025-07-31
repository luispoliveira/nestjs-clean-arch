import { Entity } from '@/shared/domain/entities/entity'
import { InMemorySearchableRepository } from '../../in-memory-searchable.repository'

type StubEntityProps = {
  name: string
  price: number
}

class StubEntity extends Entity<StubEntityProps> {}

class StubInMemorySearchableRepository extends InMemorySearchableRepository<StubEntity> {
  sortableFields: string[] = ['name']
  protected async applyFilter(
    items: StubEntity[],
    filter: string | null,
  ): Promise<StubEntity[]> {
    if (!filter) return Promise.resolve(items)

    const filteredItems = items.filter(item =>
      item.props.name.toLowerCase().includes(filter.toLowerCase()),
    )
    return Promise.resolve(filteredItems)
  }
}

describe('InMemorySearchableRepository unit tests', () => {
  let sut: StubInMemorySearchableRepository

  beforeEach(() => {
    sut = new StubInMemorySearchableRepository()
  })

  describe('applyFilter method', () => {})

  describe('applySort method', () => {})

  describe('applyPaginate method', () => {})

  describe('search method', () => {})

  it('should be an instance of InMemorySearchableRepository', () => {
    expect(sut).toBeInstanceOf(InMemorySearchableRepository)
  })
})

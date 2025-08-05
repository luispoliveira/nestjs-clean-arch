import { ConflictError } from '@/shared/domain/errors/conflict-error'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { InMemorySearchableRepository } from '@/shared/domain/repositories/in-memory-searchable.repository'
import { SortDirection } from '@/shared/domain/repositories/searchable-repository-contracts'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserRepository } from '@/users/domain/repositories/user.repository'

export class UserInMemoryRepository
  extends InMemorySearchableRepository<UserEntity>
  implements UserRepository.Repository
{
  sortableFields: string[] = ['name', 'createdAt']

  async findByEmail(email: string): Promise<UserEntity> {
    const user = this.items.find(user => user.email === email)
    if (!user) throw new NotFoundError(`User with email ${email} not found`)

    return Promise.resolve(user)
  }

  async emailExists(email: string): Promise<void> {
    const user = this.items.find(user => user.email === email)
    if (user) throw new ConflictError(`User with email ${email} already exists`)

    return Promise.resolve()
  }

  protected applyFilter(
    items: UserEntity[],
    filter: UserRepository.Filter | null,
  ): Promise<UserEntity[]> {
    if (!filter) return Promise.resolve(items)

    const filteredItems = items.filter(item =>
      item.name.toLowerCase().includes(filter.toLowerCase()),
    )
    return Promise.resolve(filteredItems)
  }

  protected async applySort(
    items: UserEntity[],
    sort: string | null,
    sortDirection: SortDirection | null,
  ): Promise<UserEntity[]> {
    return !sort
      ? super.applySort(items, 'createdAt', 'desc')
      : super.applySort(items, sort, sortDirection)
  }
}

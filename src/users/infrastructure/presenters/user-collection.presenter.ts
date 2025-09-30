import { CollectionPresenter } from '@/shared/infrastructure/presenters/collection.presenter'
import { ListUsersUseCase } from '@/users/application/usecases/list-users.usecase'
import { UserPresenter } from './user.presenter'

export class UserCollectionPresenter extends CollectionPresenter {
  data: UserPresenter[]

  constructor(output: ListUsersUseCase.Output) {
    const { items, ...paginationProps } = output
    super(paginationProps)
    this.data = items.map(item => new UserPresenter(item))
  }
}

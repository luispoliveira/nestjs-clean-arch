import {
  PaginationOutputDTO,
  PaginationOutputMapper,
} from '@/shared/application/dtos/pagination-output.dto'
import { SearchInputDTO } from '@/shared/application/dtos/search-input.dto'
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case'
import { UserRepository } from '@/users/domain/repositories/user.repository'
import { UserOutputDTO, UserOutputMapper } from '../dtos/user-output.dto'

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ListUsersUseCase {
  export type Input = SearchInputDTO

  export type Output = PaginationOutputDTO<UserOutputDTO>

  export class UseCase implements DefaultUseCase<SearchInputDTO, Output> {
    constructor(private userRepository: UserRepository.Repository) {}

    async execute(input: SearchInputDTO): Promise<Output> {
      const params = new UserRepository.SearchParams(input)
      const searchResult = await this.userRepository.search(params)

      return this.toOutput(searchResult)
    }

    private toOutput(searchResult: UserRepository.SearchResult): Output {
      const items = searchResult.items.map(item => {
        return UserOutputMapper.toOutput(item)
      })
      return PaginationOutputMapper.toOutput(items, searchResult)
    }
  }
}

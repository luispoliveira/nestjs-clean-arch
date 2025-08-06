import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case'
import { UserRepository } from '@/users/domain/repositories/user.repository'
import { UserOutputDTO, UserOutputMapper } from '../dtos/user-output.dto'
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace GetUserUseCase {
  export type Input = {
    id: string
  }

  export type Output = UserOutputDTO

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private userRepository: UserRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const entity = await this.userRepository.findById(input.id)

      return UserOutputMapper.toOutput(entity)
    }
  }
}

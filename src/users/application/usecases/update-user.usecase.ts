import { BadRequestError } from '@/shared/application/errors/bad-request-error'
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case'
import { UserRepository } from '@/users/domain/repositories/user.repository'
import { UserOutputDTO, UserOutputMapper } from '../dtos/user-output.dto'

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace UpdateUserUseCase {
  export type Input = {
    id: string
    name: string
  }

  export type Output = UserOutputDTO

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private userRepository: UserRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      if (!input.name) throw new BadRequestError('Name not provided')

      const entity = await this.userRepository.findById(input.id)

      entity.update(input.name)

      await this.userRepository.update(entity)

      return UserOutputMapper.toOutput(entity)
    }
  }
}

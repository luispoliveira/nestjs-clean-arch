import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserRepository } from '@/users/domain/repositories/user.repository'
import { BadRequestError } from '../errors/bad-request-error'

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace SignupUseCase {
  export type Input = {
    name: string
    email: string
    password: string
  }

  export type Output = {
    id: string
    name: string
    email: string
    password: string
    createdAt: Date
  }

  export class UseCase {
    constructor(private userRepository: UserRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const { name, email, password } = input

      if (!name || !email || !password)
        throw new BadRequestError('Name, email, and password are required.')

      await this.userRepository.emailExists(email)

      const entity = new UserEntity(input)

      await this.userRepository.insert(entity)

      return entity.toJSON()
    }
  }
}

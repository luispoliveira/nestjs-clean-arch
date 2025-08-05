import { HashProvider } from '@/shared/application/providers/hash.provider'
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
    constructor(
      private userRepository: UserRepository.Repository,
      private hashProvider: HashProvider,
    ) {}

    async execute(input: Input): Promise<Output> {
      const { name, email, password } = input

      if (!name || !email || !password)
        throw new BadRequestError('Name, email, and password are required.')

      await this.userRepository.emailExists(email)

      const hashedPassword = await this.hashProvider.generateHash(password)

      const entity = new UserEntity(
        Object.assign(input, { password: hashedPassword }),
      )

      await this.userRepository.insert(entity)

      return entity.toJSON()
    }
  }
}

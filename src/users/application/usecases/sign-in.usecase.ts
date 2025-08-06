import { InvalidCredentials } from '@/shared/application/errors/invalid-credentials-error'
import { HashProvider } from '@/shared/application/providers/hash.provider'
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case'
import { UserRepository } from '@/users/domain/repositories/user.repository'
import { BadRequestError } from '../../../shared/application/errors/bad-request-error'
import { UserOutputDTO, UserOutputMapper } from '../dtos/user-output.dto'
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace SignInUseCase {
  export type Input = {
    email: string
    password: string
  }

  export type Output = UserOutputDTO

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(
      private userRepository: UserRepository.Repository,
      private hashProvider: HashProvider,
    ) {}

    async execute(input: Input): Promise<Output> {
      const { email, password } = input

      if (!email || !password)
        throw new BadRequestError('Email and password are required.')

      const user = await this.userRepository.findByEmail(email)

      const isValid = await this.hashProvider.compareHash(
        password,
        user.password,
      )

      if (!isValid) {
        throw new InvalidCredentials('Invalid email or password.')
      }

      return UserOutputMapper.toOutput(user)
    }
  }
}

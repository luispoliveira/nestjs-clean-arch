import { SignInUseCase } from '@/users/application/usecases/sign-in.usecase'

export class SignInDto implements SignInUseCase.Input {
  email: string
  password: string
}

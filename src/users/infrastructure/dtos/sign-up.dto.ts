import { SignUpUseCase } from '@/users/application/usecases/sign-up.usecase'

export class SignUpDto implements SignUpUseCase.Input {
  name: string
  email: string
  password: string
}

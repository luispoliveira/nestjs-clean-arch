import { SignInUseCase } from '@/users/application/usecases/sign-in.usecase'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class SignInDto implements SignInUseCase.Input {
  @IsString()
  @IsEmail()
  email: string

  @IsString()
  @IsNotEmpty()
  password: string
}

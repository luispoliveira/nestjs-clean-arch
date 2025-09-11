import { SignUpUseCase } from '@/users/application/usecases/sign-up.usecase'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class SignUpDto implements SignUpUseCase.Input {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsEmail()
  email: string

  @IsString()
  @IsNotEmpty()
  password: string
}

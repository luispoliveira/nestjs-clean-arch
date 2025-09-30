import { SignInUseCase } from '@/users/application/usecases/sign-in.usecase'
import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class SignInDto implements SignInUseCase.Input {
  @ApiProperty({
    description: 'Email of the user',
    example: 'john.doe@example.com',
  })
  @IsString()
  @IsEmail()
  email: string

  @ApiProperty({
    description: 'Password of the user',
    example: 'strongPassword123',
  })
  @IsString()
  @IsNotEmpty()
  password: string
}

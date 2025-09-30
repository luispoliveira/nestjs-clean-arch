import { SignUpUseCase } from '@/users/application/usecases/sign-up.usecase'
import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class SignUpDto implements SignUpUseCase.Input {
  @ApiProperty({ description: 'Name of the user', example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({
    description: 'Email of the user',
    example: 'john.doe@example.com',
  })
  @IsString()
  @IsNotEmpty()
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

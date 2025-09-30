import { UpdatePasswordUseCase } from '@/users/application/usecases/update-password.usecase'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class UpdatePasswordDto
  implements Omit<UpdatePasswordUseCase.Input, 'id'>
{
  @ApiProperty({
    description: 'Old password of the user',
    example: 'oldStrongPassword123',
  })
  @IsString()
  @IsNotEmpty()
  oldPassword: string

  @ApiProperty({
    description: 'New password of the user',
    example: 'newStrongPassword123',
  })
  @IsString()
  @IsNotEmpty()
  password: string
}

import { UserOutputDTO } from '@/users/application/dtos/user-output.dto'
import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'

export class UserPresenter {
  @ApiProperty({ example: 'asdf', description: 'User unique identifier' })
  id: string

  @ApiProperty({ example: 'John Doe', description: 'User full name' })
  name: string

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User email address',
  })
  email: string

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'User creation date',
  })
  @Transform(({ value }: { value: Date }) => value.toISOString())
  createdAt: Date

  constructor(output: UserOutputDTO) {
    this.id = output.id
    this.name = output.name
    this.email = output.email
    this.createdAt = output.createdAt
  }
}

import { AuthGuard } from '@/auth/infrastructure/auth.guard'
import { AuthService } from '@/auth/infrastructure/auth.service'
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger'
import { UserOutputDTO } from '../application/dtos/user-output.dto'
import { DeleteUserUseCase } from '../application/usecases/delete-user.usecase'
import { GetUserUseCase } from '../application/usecases/get-user.usecase'
import { ListUsersUseCase } from '../application/usecases/list-users.usecase'
import { SignInUseCase } from '../application/usecases/sign-in.usecase'
import { SignUpUseCase } from '../application/usecases/sign-up.usecase'
import { UpdatePasswordUseCase } from '../application/usecases/update-password.usecase'
import { UpdateUserUseCase } from '../application/usecases/update-user.usecase'
import { ListUsersDto } from './dtos/list-users.dto'
import { SignInDto } from './dtos/sign-in.dto'
import { SignUpDto } from './dtos/sign-up.dto'
import { UpdatePasswordDto } from './dtos/update-password.dto'
import { UpdateUserDto } from './dtos/update-user.dto'
import { UserCollectionPresenter } from './presenters/user-collection.presenter'
import { UserPresenter } from './presenters/user.presenter'

@ApiTags('users')
@Controller('users')
export class UsersController {
  @Inject(SignUpUseCase.UseCase)
  private signUpUseCase: SignUpUseCase.UseCase

  @Inject(SignInUseCase.UseCase)
  private signInUseCase: SignInUseCase.UseCase

  @Inject(GetUserUseCase.UseCase)
  private getUserUseCase: GetUserUseCase.UseCase

  @Inject(ListUsersUseCase.UseCase)
  private listUsersUseCase: ListUsersUseCase.UseCase

  @Inject(UpdateUserUseCase.UseCase)
  private updateUserUseCase: UpdateUserUseCase.UseCase

  @Inject(UpdatePasswordUseCase.UseCase)
  private updatePasswordUseCase: UpdatePasswordUseCase.UseCase

  @Inject(DeleteUserUseCase.UseCase)
  private deleteUserUseCase: DeleteUserUseCase.UseCase

  @Inject(AuthService)
  private authService: AuthService

  static userToResponse(output: UserOutputDTO) {
    return new UserPresenter(output)
  }

  static listUsersToResponse(output: ListUsersUseCase.Output) {
    return new UserCollectionPresenter(output)
  }

  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    schema: { $ref: getSchemaPath(UserPresenter) },
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict Error',
  })
  @ApiResponse({
    status: 422,
    description: 'Validation Error',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @HttpCode(201)
  @Post()
  async create(@Body() signUpDto: SignUpDto) {
    const output = await this.signUpUseCase.execute(signUpDto)
    return UsersController.userToResponse(output)
  }

  @ApiResponse({
    status: 200,
    description: 'The user has been successfully authenticated.',
    schema: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 422,
    description: 'Validation Error',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @HttpCode(200)
  @Post('login')
  async signIn(@Body() signInDto: SignInDto) {
    const output = await this.signInUseCase.execute(signInDto)
    return this.authService.generateJwt(output.id)
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        meta: {
          type: 'object',
          properties: {
            total: { type: 'number', example: 100 },
            currentPage: { type: 'number', example: 10 },
            lastPage: { type: 'number', example: 10 },
            perPage: { type: 'number', example: 10 },
          },
        },
        data: {
          type: 'array',
          items: { $ref: getSchemaPath(UserPresenter) },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 422,
    description: 'Validation Error',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @UseGuards(AuthGuard)
  @Get()
  async search(@Query() query: ListUsersDto) {
    const output = await this.listUsersUseCase.execute(query)
    return UsersController.listUsersToResponse(output)
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully retrieved.',
    schema: { $ref: getSchemaPath(UserPresenter) },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'User Not Found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const output = await this.getUserUseCase.execute({ id })
    return UsersController.userToResponse(output)
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
    schema: { $ref: getSchemaPath(UserPresenter) },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'User Not Found',
  })
  @ApiResponse({
    status: 422,
    description: 'Validation Error',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @UseGuards(AuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const output = await this.updateUserUseCase.execute({
      id,
      ...updateUserDto,
    })
    return UsersController.userToResponse(output)
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'The user password has been successfully updated.',
    schema: { $ref: getSchemaPath(UserPresenter) },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'User Not Found',
  })
  @ApiResponse({
    status: 422,
    description: 'Validation Error',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @UseGuards(AuthGuard)
  @Patch(':id')
  async updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const output = await this.updatePasswordUseCase.execute({
      id,
      ...updatePasswordDto,
    })
    return UsersController.userToResponse(output)
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 204,
    description: 'The user has been successfully deleted.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'User Not Found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @UseGuards(AuthGuard)
  @HttpCode(204)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.deleteUserUseCase.execute({ id })
  }
}

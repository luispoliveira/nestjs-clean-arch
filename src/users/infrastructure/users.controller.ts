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
} from '@nestjs/common'
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

  @Post()
  async create(@Body() signUpDto: SignUpDto) {
    const output = await this.signUpUseCase.execute(signUpDto)
    return UsersController.userToResponse(output)
  }

  @HttpCode(200)
  @Post('login')
  async signIn(@Body() signInDto: SignInDto) {
    const output = await this.signInUseCase.execute(signInDto)
    return this.authService.generateJwt(output.id)
  }

  @Get()
  async search(@Query() query: ListUsersDto) {
    const output = await this.listUsersUseCase.execute(query)
    return UsersController.listUsersToResponse(output)
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const output = await this.getUserUseCase.execute({ id })
    return UsersController.userToResponse(output)
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const output = await this.updateUserUseCase.execute({
      id,
      ...updateUserDto,
    })
    return UsersController.userToResponse(output)
  }

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

  @HttpCode(204)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.deleteUserUseCase.execute({ id })
  }
}

import { InvalidPasswordError } from '@/shared/application/errors/invalid-password-error'
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'
import { FastifyReply } from 'fastify'

@Catch(InvalidPasswordError)
export class InvalidPasswordErrorFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<FastifyReply>()
    const status = 422

    response.status(status).send({
      statusCode: status,
      error: 'Unprocessable Entity',
      message: (exception as unknown as InvalidPasswordError).message,
    })
  }
}

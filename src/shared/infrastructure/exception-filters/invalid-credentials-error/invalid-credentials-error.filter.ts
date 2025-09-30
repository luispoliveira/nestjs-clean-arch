import { InvalidCredentialsError } from '@/shared/application/errors/invalid-credentials-error'
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'
import { FastifyReply } from 'fastify'

@Catch(InvalidCredentialsError)
export class InvalidCredentialsErrorFilter implements ExceptionFilter {
  catch(exception: InvalidCredentialsError, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<FastifyReply>()
    const status = 400

    response.status(status).send({
      statusCode: status,
      error: 'Bad Request',
      message: (exception as unknown as InvalidCredentialsError).message,
    })
  }
}

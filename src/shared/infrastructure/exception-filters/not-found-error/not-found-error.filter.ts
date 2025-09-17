import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'
import { FastifyReply } from 'fastify'

@Catch(NotFoundError)
export class NotFoundErrorFilter implements ExceptionFilter {
  catch(exception: NotFoundError, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<FastifyReply>()
    const status = 404

    response.status(status).send({
      statusCode: status,
      error: 'Not Found',
      message: (exception as unknown as NotFoundError).message,
    })
  }
}

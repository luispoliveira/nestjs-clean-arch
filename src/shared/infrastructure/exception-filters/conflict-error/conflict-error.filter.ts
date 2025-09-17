import { ConflictError } from '@/shared/domain/errors/conflict-error'
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'
import { FastifyReply } from 'fastify'
@Catch(ConflictError)
export class ConflictErrorFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<FastifyReply>()
    const status = 409

    response.status(status).send({
      statusCode: status,
      error: 'Conflict',
      message: (exception as unknown as ConflictError).message,
    })
  }
}

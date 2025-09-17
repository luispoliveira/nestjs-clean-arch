import { of } from 'rxjs'
import { WrapperDataInterceptor } from '../../wrapper-data.interceptor'

describe('WrapperDataInterceptor unit tests', () => {
  let interceptor: WrapperDataInterceptor
  let props: any
  beforeEach(() => {
    interceptor = new WrapperDataInterceptor()
    props = {
      name: 'test',
      email: 'test@example.com',
      password: 'hashedPassword',
    }
  })
  it('should be defined', () => {
    expect(interceptor).toBeDefined()
  })

  it('should wrap data if body does not have meta or data', () => {
    const obs$ = interceptor.intercept({} as any, { handle: () => of(props) })
    obs$.subscribe({
      next: value => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        expect(value).toStrictEqual({ data: props })
      },
    })
  })

  it('should not wrap data if body does have meta or data', () => {
    const result = { data: [props], meta: { total: 1 } }
    const obs$ = interceptor.intercept({} as any, { handle: () => of(result) })
    obs$.subscribe({
      next: value => {
        expect(value).toStrictEqual(result)
      },
    })
  })
})

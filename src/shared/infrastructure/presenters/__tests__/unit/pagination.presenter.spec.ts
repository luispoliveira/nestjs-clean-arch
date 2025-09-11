import {
  PaginationPresenter,
  PaginationPresenterProps,
} from '../../pagination.presenter'

describe('Pagination presenter unit test', () => {
  let sut: PaginationPresenter
  const props: PaginationPresenterProps = {
    currentPage: 1,
    perPage: 10,
    lastPage: 5,
    total: 50,
  }
  beforeEach(() => {
    sut = new PaginationPresenter(props)
  })
  it('should be defined', () => {
    expect(sut).toBeDefined()
  })

  describe('constructor', () => {
    it('should set properties correctly', () => {
      expect(sut.currentPage).toBe(props.currentPage)
      expect(sut.perPage).toBe(props.perPage)
      expect(sut.lastPage).toBe(props.lastPage)
      expect(sut.total).toBe(props.total)
    })
  })

  it('should transform properties to integers', () => {
    expect(typeof sut.currentPage).toBe('number')
    expect(typeof sut.perPage).toBe('number')
    expect(typeof sut.lastPage).toBe('number')
    expect(typeof sut.total).toBe('number')
  })
})

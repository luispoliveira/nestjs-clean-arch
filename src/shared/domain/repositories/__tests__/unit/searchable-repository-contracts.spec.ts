import { SearchParams } from '../../searchable-repository-contracts'

describe('SearchableRepositoryContracts unit tests', () => {
  describe('SearchParams tests', () => {
    it('page prop', () => {
      const sut = new SearchParams()
      expect(sut.page).toBe(1)

      const params = [
        { page: true, expected: 1 },
        { page: 0, expected: 1 },
        { page: -1, expected: 1 },
        { page: 1, expected: 1 },
        { page: 2, expected: 2 },
        { page: '', expected: 1 },
        { page: '0', expected: 1 },
        { page: '1', expected: 1 },
        { page: '2', expected: 2 },
        { page: 'a', expected: 1 },
        { page: null, expected: 1 },
        { page: undefined, expected: 1 },
      ]

      for (const param of params) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const searchParams = new SearchParams({ page: param.page as any })
        expect(searchParams.page).toBe(param.expected)
      }
    })

    it('perPage prop', () => {
      const sut = new SearchParams()
      expect(sut.perPage).toBe(15)

      const params = [
        { perPage: true, expected: 15 },
        { perPage: 0, expected: 15 },
        { perPage: -1, expected: 15 },
        { perPage: 1, expected: 1 },
        { perPage: 2, expected: 2 },
        { perPage: '', expected: 15 },
        { perPage: '0', expected: 15 },
        { perPage: '1', expected: 1 },
        { perPage: '2', expected: 2 },
        { perPage: 'a', expected: 15 },
        { perPage: null, expected: 15 },
        { perPage: undefined, expected: 15 },
      ]

      for (const param of params) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const searchParams = new SearchParams({ perPage: param.perPage as any })
        expect(searchParams.perPage).toBe(param.expected)
      }
    })

    it('sort prop', () => {
      const sut = new SearchParams()
      expect(sut.sort).toBeNull()

      const params = [
        { sort: '', expected: null },
        { sort: 'name', expected: 'name' },
        { sort: null, expected: null },
        { sort: undefined, expected: null },
        { sort: true, expected: null },
        { sort: {}, expected: '[object Object]' },
        { sort: -1, expected: '-1' },
        { sort: 0, expected: '0' },
        { sort: 1, expected: '1' },
        { sort: 2, expected: '2' },
      ]

      for (const param of params) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const searchParams = new SearchParams({ sort: param.sort as any })
        expect(searchParams.sort).toBe(param.expected)
      }
    })

    it('sortDirection prop', () => {
      let sut = new SearchParams()
      expect(sut.sortDirection).toBeNull()

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      sut = new SearchParams({ sort: null as any })
      expect(sut.sortDirection).toBeNull()

      sut = new SearchParams({ sort: 'name' })
      expect(sut.sortDirection).toEqual('desc')

      sut = new SearchParams({ sort: 'name', sortDirection: null })
      expect(sut.sortDirection).toEqual('desc')

      sut = new SearchParams({ sort: 'name', sortDirection: undefined })
      expect(sut.sortDirection).toEqual('desc')

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      sut = new SearchParams({ sort: 'name', sortDirection: true as any })
      expect(sut.sortDirection).toEqual('desc')

      const params = [
        { sortDirection: '', expected: 'desc' },
        { sortDirection: '  ', expected: 'desc' },
        { sortDirection: 'asc', expected: 'asc' },
        { sortDirection: 'desc', expected: 'desc' },
        { sortDirection: null, expected: 'desc' },
        { sortDirection: undefined, expected: 'desc' },
        { sortDirection: true, expected: 'desc' },
        { sortDirection: {}, expected: 'desc' },
        { sortDirection: -1, expected: 'desc' },
        { sortDirection: 0, expected: 'desc' },
        { sortDirection: 1, expected: 'desc' },
        { sortDirection: 2, expected: 'desc' },
        { sortDirection: 'a', expected: 'desc' },
        { sortDirection: 'ASC', expected: 'asc' },
        { sortDirection: 'DESC', expected: 'desc' },
        { sortDirection: 'AsC', expected: 'asc' },
        { sortDirection: 'DeSc', expected: 'desc' },
      ]

      for (const param of params) {
        const searchParams = new SearchParams({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          sortDirection: param.sortDirection as any,
          sort: 'name',
        })
        expect(searchParams.sortDirection).toBe(param.expected)
      }
    })

    it('filter prop', () => {
      const sut = new SearchParams()
      expect(sut.filter).toBeNull()

      const params = [
        { filter: '', expected: '' },
        { filter: 'name', expected: 'name' },
        { filter: null, expected: null },
        { filter: undefined, expected: null },
        { filter: true, expected: null },
        { filter: {}, expected: '[object Object]' },
        { filter: -1, expected: '-1' },
        { filter: 0, expected: '0' },
        { filter: 1, expected: '1' },
        { filter: 2, expected: '2' },
      ]

      for (const param of params) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const searchParams = new SearchParams({ filter: param.filter as any })
        expect(searchParams.filter).toBe(param.expected)
      }
    })
  })
})

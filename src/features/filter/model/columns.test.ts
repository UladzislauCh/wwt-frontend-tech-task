import { getColumnCount } from './columns'

describe('getColumnCount', () => {
	it.each([
		[1, 1],
		[2, 1],
		[3, 3],
		[4, 2],
		[5, 3],
		[6, 3],
		[18, 3]
	])('%i options → %i columns', (optionsCount, columnCount) => {
		expect(getColumnCount(optionsCount)).toBe(columnCount)
	})
})

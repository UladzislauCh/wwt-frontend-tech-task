import { FilterType } from '@/shared/api/types/Filter'
import { SearchRequestFilter } from '@/shared/api/types/SearchRequest/SearchRequestFilter'

import { useFilterStore } from './filterStore'

describe('filterStore', () => {
	beforeEach(() => {
		useFilterStore.setState({ selectedFilters: [] })
	})

	it('starts with no selected filters', () => {
		expect(useFilterStore.getState().selectedFilters).toEqual([])
	})

	it('replaces selected filters', () => {
		const selectedFilters: SearchRequestFilter = [
			{
				id: 'MEAL_OPTIONS',
				type: FilterType.OPTION,
				optionsIds: ['breakfast', 'dinner']
			}
		]

		useFilterStore.getState().setSelectedFilters(selectedFilters)

		expect(useFilterStore.getState().selectedFilters).toEqual(selectedFilters)
	})
})

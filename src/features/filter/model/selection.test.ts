import { FilterItem, FilterType } from '@/shared/api/types/Filter'

import {
	hasSelectionChanged,
	toSearchRequestFilter,
	toSelectedOptions,
	toggleOption
} from './selection'

const filterItems: FilterItem[] = [
	{
		id: 'MEAL',
		name: 'Meal options',
		type: FilterType.OPTION,
		options: [
			{ id: 'breakfast', name: 'Breakfast' },
			{ id: 'lunch', name: 'Lunch' },
			{ id: 'dinner', name: 'Dinner' }
		]
	},
	{
		id: 'BED',
		name: 'Bed type',
		type: FilterType.OPTION,
		options: [
			{ id: 'twin', name: 'Twin beds' },
			{ id: 'double', name: 'Double bed' }
		]
	}
]

describe('toSelectedOptions', () => {
	it('maps filter ids to selected option ids', () => {
		expect(
			toSelectedOptions([
				{ id: 'MEAL', type: FilterType.OPTION, optionsIds: ['lunch'] }
			])
		).toEqual({ MEAL: ['lunch'] })
	})
})

describe('toSearchRequestFilter', () => {
	it('follows the API order of filters and options', () => {
		expect(
			toSearchRequestFilter(filterItems, {
				BED: ['double'],
				MEAL: ['dinner', 'breakfast']
			})
		).toEqual([
			{
				id: 'MEAL',
				type: FilterType.OPTION,
				optionsIds: ['breakfast', 'dinner']
			},
			{ id: 'BED', type: FilterType.OPTION, optionsIds: ['double'] }
		])
	})

	it('drops empty groups and ids unknown to the API', () => {
		expect(
			toSearchRequestFilter(filterItems, {
				MEAL: [],
				BED: ['bunk'],
				UNKNOWN: ['anything']
			})
		).toEqual([])
	})

	it('is the inverse of toSelectedOptions', () => {
		const searchRequestFilter = [
			{ id: 'MEAL', type: FilterType.OPTION, optionsIds: ['lunch'] }
		]

		expect(
			toSearchRequestFilter(filterItems, toSelectedOptions(searchRequestFilter))
		).toEqual(searchRequestFilter)
	})
})

describe('toggleOption', () => {
	it('selects an option that is not selected', () => {
		expect(toggleOption({}, 'MEAL', 'lunch')).toEqual({ MEAL: ['lunch'] })
	})

	it('deselects an option that is selected', () => {
		expect(
			toggleOption({ MEAL: ['lunch', 'dinner'] }, 'MEAL', 'lunch')
		).toEqual({ MEAL: ['dinner'] })
	})

	it('does not mutate the original selection', () => {
		const selectedOptions = { MEAL: ['lunch'] }

		toggleOption(selectedOptions, 'MEAL', 'dinner')

		expect(selectedOptions).toEqual({ MEAL: ['lunch'] })
	})
})

describe('hasSelectionChanged', () => {
	const savedFilters = [
		{ id: 'MEAL', type: FilterType.OPTION, optionsIds: ['breakfast', 'dinner'] }
	]

	it('is false for the same selection in a different order', () => {
		expect(
			hasSelectionChanged(filterItems, savedFilters, {
				MEAL: ['dinner', 'breakfast']
			})
		).toBe(false)
	})

	it('is false when an option was toggled back', () => {
		const toggledTwice = toggleOption(
			toggleOption(toSelectedOptions(savedFilters), 'BED', 'twin'),
			'BED',
			'twin'
		)

		expect(hasSelectionChanged(filterItems, savedFilters, toggledTwice)).toBe(
			false
		)
	})

	it('is true when an option was added or removed', () => {
		expect(
			hasSelectionChanged(filterItems, savedFilters, {
				MEAL: ['breakfast', 'dinner'],
				BED: ['twin']
			})
		).toBe(true)
		expect(
			hasSelectionChanged(filterItems, savedFilters, { MEAL: ['breakfast'] })
		).toBe(true)
	})
})

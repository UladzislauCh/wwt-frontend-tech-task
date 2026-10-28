import { FilterItem } from '@/shared/api/types/Filter'
import { SearchRequestFilter } from '@/shared/api/types/SearchRequest/SearchRequestFilter'

// Draft selection inside the modal: filter id → selected option ids
export type SelectedOptions = Record<string, string[]>

export const toSelectedOptions = (
	searchRequestFilter: SearchRequestFilter
): SelectedOptions =>
	Object.fromEntries(
		searchRequestFilter.map(filter => [filter.id, filter.optionsIds])
	)

// Output follows the API order of filters and options, so the result doesn't depend on click order.
// Empty groups and ids unknown to the API are dropped
export const toSearchRequestFilter = (
	filterItems: FilterItem[],
	selectedOptions: SelectedOptions
): SearchRequestFilter =>
	filterItems
		.map(filterItem => {
			const selectedIds = selectedOptions[filterItem.id] ?? []

			return {
				id: filterItem.id,
				type: filterItem.type,
				optionsIds: filterItem.options
					.map(option => option.id)
					.filter(optionId => selectedIds.includes(optionId))
			}
		})
		.filter(filter => filter.optionsIds.length > 0)

// Both sides are normalized to the API order, so click order and toggling an option back and forth don't count as changes
export const hasSelectionChanged = (
	filterItems: FilterItem[],
	savedFilters: SearchRequestFilter,
	selectedOptions: SelectedOptions
): boolean => {
	const saved = toSearchRequestFilter(
		filterItems,
		toSelectedOptions(savedFilters)
	)
	const draft = toSearchRequestFilter(filterItems, selectedOptions)

	return JSON.stringify(saved) !== JSON.stringify(draft)
}

export const toggleOption = (
	selectedOptions: SelectedOptions,
	filterId: string,
	optionId: string
): SelectedOptions => {
	const selectedIds = selectedOptions[filterId] ?? []

	return {
		...selectedOptions,
		[filterId]: selectedIds.includes(optionId)
			? selectedIds.filter(id => id !== optionId)
			: [...selectedIds, optionId]
	}
}

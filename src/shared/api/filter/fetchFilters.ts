import { API_ROUTES } from '../apiRoutes'
import { FilterItem } from '../types/Filter'

interface FiltersResponse {
	filterItems: FilterItem[]
}

export const fetchFilters = async (): Promise<FilterItem[]> => {
	const response = await fetch(API_ROUTES.filters)

	if (!response.ok) {
		throw new Error(`Failed to fetch filters: ${response.status}`)
	}

	const data: FiltersResponse = await response.json()

	return data.filterItems
}

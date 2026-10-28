import { useQuery } from '@tanstack/react-query'

import { fetchFilters } from './fetchFilters'

export const filtersQueryKey = ['filters'] as const

// Kept short: while retrying, the modal shows a loader instead of the cached filters
const RETRY_COUNT = 2
const RETRY_DELAY_MS = 1000

export const useFiltersQuery = () =>
	useQuery({
		queryKey: filtersQueryKey,
		queryFn: fetchFilters,
		// Fresh filters are requested on every opening, even if the cached ones aren't stale yet
		refetchOnMount: 'always',
		retry: RETRY_COUNT,
		retryDelay: RETRY_DELAY_MS
	})

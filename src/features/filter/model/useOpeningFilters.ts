import { useState } from 'react'

import { useFiltersQuery } from '@/shared/api/filter'

// Filters to show in the modal for the current opening.
// Must be called from a component that mounts when the modal opens.
//
// - A loader is shown until the request started by this opening succeeds or finally fails (after retries)
// - If it fails, cached filters from an earlier opening are shown when available, otherwise an error
// - Offline, react-query pauses the request instead of failing it: that counts as a failure right away,
//   and the paused request resumes by itself once the connection is back
// - Background refetches while the modal is open never bring the loader back
export const useOpeningFilters = () => {
	const [openedAt] = useState(() => Date.now())
	const { data, dataUpdatedAt, errorUpdatedAt, fetchStatus, refetch } =
		useFiltersQuery()

	const isFetching = fetchStatus === 'fetching'
	const isOffline = fetchStatus === 'paused'
	const isSettled =
		isOffline || dataUpdatedAt >= openedAt || errorUpdatedAt >= openedAt
	const filterItems = isSettled ? data : undefined

	return {
		filterItems,
		// Without data a manual retry or a resumed request also shows the loader
		isLoading: !isSettled || (isFetching && !data),
		isError: isSettled && !isFetching && !data,
		isOffline,
		retry: () => refetch()
	}
}

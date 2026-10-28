import { HttpResponse, delay, http } from 'msw'

import filterData from '@/shared/temp/filterData.json'

import { API_ROUTES } from '../apiRoutes'

export const handlers = [
	http.get(API_ROUTES.filters, async () => {
		// Realistic random latency in the browser (so loading states are visible), no delay in tests
		await delay()

		return HttpResponse.json(filterData)
	})
]

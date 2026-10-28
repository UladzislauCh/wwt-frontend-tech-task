import {
	QueryClient,
	QueryClientProvider,
	onlineManager
} from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import { HttpResponse, http } from 'msw'

import { useFilterStore } from '@/features/filter'
import { API_ROUTES } from '@/shared/api/apiRoutes'
import { server } from '@/shared/api/mocks/node'
import { FilterType } from '@/shared/api/types/Filter'

import { App } from './App'

const renderApp = () => {
	// Fresh client per test, so no cache is shared between tests
	const queryClient = new QueryClient()

	render(
		<QueryClientProvider client={queryClient}>
			<App />
		</QueryClientProvider>
	)

	return { queryClient }
}

const click = (name: string) =>
	fireEvent.click(screen.getByRole('button', { name }))

const openFilters = async () => {
	click('Open filters')
	// Wait until filters are loaded from the mock API
	await screen.findByRole('checkbox', { name: 'Breakfast included' })
}

const toggle = (name: string) =>
	fireEvent.click(screen.getByRole('checkbox', { name }))

const getAppliedFilters = () =>
	JSON.parse(screen.getByText(/^\[/).textContent ?? '')

describe('Filter flow', () => {
	beforeEach(() => {
		useFilterStore.setState({ selectedFilters: [] })
	})

	it('applies the selection after confirmation', async () => {
		renderApp()
		await openFilters()

		toggle('Dinner included')
		toggle('Breakfast included')
		toggle('Pets allowed')
		click('Apply')

		// Nothing is saved until the user confirms
		expect(
			screen.getByRole('heading', { name: 'Do you want to apply new filter' })
		).toBeInTheDocument()
		expect(getAppliedFilters()).toEqual([])

		click('Apply new filter')

		expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
		expect(getAppliedFilters()).toEqual([
			{
				id: 'MEAL_OPTIONS',
				type: 'OPTION',
				optionsIds: ['breakfast', 'dinner']
			},
			{
				id: 'RULES_POLICIES_PAYMENT',
				type: 'OPTION',
				optionsIds: ['pets-allowed']
			}
		])
	})

	it('enables Apply only when the selection differs from the applied filters', async () => {
		useFilterStore.setState({
			selectedFilters: [
				{ id: 'FACILITIES', type: FilterType.OPTION, optionsIds: ['wi-fi'] }
			]
		})

		renderApp()
		await openFilters()

		const applyButton = screen.getByRole('button', { name: 'Apply' })

		expect(applyButton).toBeDisabled()

		toggle('Gym')
		expect(applyButton).toBeEnabled()

		// Back to the applied state: nothing to apply again
		toggle('Gym')
		expect(applyButton).toBeDisabled()
	})

	it('enables Clear all only when some option is selected', async () => {
		renderApp()
		await openFilters()

		const clearButton = screen.getByRole('button', {
			name: 'Clear all parameters'
		})

		expect(clearButton).toBeDisabled()

		toggle('Gym')
		expect(clearButton).toBeEnabled()

		click('Clear all parameters')
		expect(clearButton).toBeDisabled()
	})

	it('prefills the modal with the applied filters', async () => {
		useFilterStore.setState({
			selectedFilters: [
				{ id: 'FACILITIES', type: FilterType.OPTION, optionsIds: ['wi-fi'] }
			]
		})

		renderApp()
		await openFilters()

		expect(screen.getByRole('checkbox', { name: 'Wi-Fi' })).toBeChecked()
		expect(screen.getByRole('checkbox', { name: 'Heating' })).not.toBeChecked()
	})

	it('keeps the old filters when the user declines', async () => {
		useFilterStore.setState({
			selectedFilters: [
				{ id: 'FACILITIES', type: FilterType.OPTION, optionsIds: ['wi-fi'] }
			]
		})

		renderApp()
		await openFilters()

		toggle('Wi-Fi')
		toggle('Gym')
		click('Apply')
		click('Use old filter')

		expect(getAppliedFilters()).toEqual([
			{ id: 'FACILITIES', type: 'OPTION', optionsIds: ['wi-fi'] }
		])

		// The discarded draft must not show up on the next opening
		await openFilters()

		expect(screen.getByRole('checkbox', { name: 'Wi-Fi' })).toBeChecked()
		expect(screen.getByRole('checkbox', { name: 'Gym' })).not.toBeChecked()
	})

	it('discards changes when the modal is closed without applying', async () => {
		renderApp()
		await openFilters()

		toggle('Spa')
		click('Close')

		expect(getAppliedFilters()).toEqual([])
	})

	it('clears all selected options', async () => {
		useFilterStore.setState({
			selectedFilters: [
				{ id: 'FACILITIES', type: FilterType.OPTION, optionsIds: ['wi-fi'] },
				{ id: 'BED_TYPE', type: FilterType.OPTION, optionsIds: ['twin-beds'] }
			]
		})

		renderApp()
		await openFilters()

		click('Clear all parameters')

		for (const checkbox of screen.getAllByRole('checkbox')) {
			expect(checkbox).not.toBeChecked()
		}

		click('Apply')
		click('Apply new filter')

		expect(getAppliedFilters()).toEqual([])
	})
})

describe('Filters loading', () => {
	// Failed requests are retried twice with a 1s delay before the result is shown
	const RETRIES_TIMEOUT = { timeout: 4000 }
	const TEST_TIMEOUT = 10_000

	const failRequests = () =>
		server.use(http.get(API_ROUTES.filters, () => HttpResponse.error()))

	beforeEach(() => {
		useFilterStore.setState({ selectedFilters: [] })
	})

	afterEach(() => {
		onlineManager.setOnline(true)
	})

	it('shows previously loaded filters right away when offline', async () => {
		renderApp()
		await openFilters()
		click('Close')

		onlineManager.setOnline(false)
		click('Open filters')

		// No loader: offline, react-query pauses the request instead of sending it
		expect(screen.queryByRole('status')).not.toBeInTheDocument()
		expect(
			screen.getByRole('checkbox', { name: 'Breakfast included' })
		).toBeInTheDocument()
	})

	it('loads filters once the connection is back', async () => {
		onlineManager.setOnline(false)
		renderApp()
		click('Open filters')

		expect(
			screen.getByText(
				'No internet connection. Filters will load once you are back online'
			)
		).toBeInTheDocument()
		expect(
			screen.queryByRole('button', { name: 'Try again' })
		).not.toBeInTheDocument()

		onlineManager.setOnline(true)

		expect(
			await screen.findByRole('checkbox', { name: 'Breakfast included' })
		).toBeInTheDocument()
	})

	it(
		'shows an error with a retry when filters were never loaded',
		async () => {
			failRequests()
			renderApp()
			click('Open filters')

			expect(screen.getByRole('status')).toBeInTheDocument()
			expect(
				await screen.findByText('Failed to load filters', {}, RETRIES_TIMEOUT)
			).toBeInTheDocument()

			server.resetHandlers()
			click('Try again')

			expect(
				await screen.findByRole('checkbox', { name: 'Breakfast included' })
			).toBeInTheDocument()
			expect(
				screen.queryByText('Failed to load filters')
			).not.toBeInTheDocument()
		},
		TEST_TIMEOUT
	)

	it(
		'falls back to previously loaded filters when the request fails',
		async () => {
			renderApp()
			await openFilters()
			click('Close')

			failRequests()
			click('Open filters')

			// The cached filters are not shown until the new request settles
			expect(screen.getByRole('status')).toBeInTheDocument()
			expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()

			expect(
				await screen.findByRole(
					'checkbox',
					{ name: 'Breakfast included' },
					RETRIES_TIMEOUT
				)
			).toBeInTheDocument()
			expect(
				screen.queryByText('Failed to load filters')
			).not.toBeInTheDocument()
		},
		TEST_TIMEOUT
	)

	it('keeps the filters on screen during a background refetch', async () => {
		const { queryClient } = renderApp()
		await openFilters()
		toggle('Gym')

		// E.g. react-query refetches when the user returns to the browser tab
		const refetch = queryClient.refetchQueries()

		expect(screen.queryByRole('status')).not.toBeInTheDocument()
		expect(screen.getByRole('checkbox', { name: 'Gym' })).toBeChecked()

		await refetch

		expect(screen.queryByRole('status')).not.toBeInTheDocument()
		expect(screen.getByRole('checkbox', { name: 'Gym' })).toBeChecked()
	})

	it('loads fresh filters on every opening', async () => {
		renderApp()
		await openFilters()
		click('Close')

		server.use(
			http.get(API_ROUTES.filters, () =>
				HttpResponse.json({
					filterItems: [
						{
							id: 'BED_TYPE',
							name: 'Bed type',
							type: 'OPTION',
							options: [{ id: 'twin-beds', name: 'Twin beds' }]
						}
					]
				})
			)
		)
		click('Open filters')

		expect(
			await screen.findByRole('checkbox', { name: 'Twin beds' })
		).toBeInTheDocument()
		expect(
			screen.queryByRole('checkbox', { name: 'Breakfast included' })
		).not.toBeInTheDocument()
	})
})

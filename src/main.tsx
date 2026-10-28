import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { QueryClientProvider } from '@tanstack/react-query'

import './main.css'
import { App } from './pages/Home'
import { queryClient } from './query'
import './shared/i18n'

// There is no real backend, so the mock API is enabled in every environment.
// Remove this once the real API is available.
const enableMocking = async () => {
	const { worker } = await import('./shared/api/mocks/browser')

	return worker.start({ onUnhandledRequest: 'bypass' })
}

const renderApp = () => {
	createRoot(document.getElementById('root')!).render(
		<StrictMode>
			<QueryClientProvider client={queryClient}>
				<App />
			</QueryClientProvider>
		</StrictMode>
	)
}

// The app must render even if the mock worker fails to start:
// requests will fail and the UI will show its error state instead of a blank page
enableMocking()
	.catch(error => console.error(error))
	.finally(renderApp)

import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { FilterModal, useFilterStore } from '@/features/filter'
import { Button } from '@/shared/ui/Button'

export const App = () => {
	const { t } = useTranslation('filter')
	const [isFilterOpen, setIsFilterOpen] = useState(false)
	const selectedFilters = useFilterStore(state => state.selectedFilters)

	return (
		<section className="flex min-h-dvh w-full flex-col items-center justify-center py-12">
			{/* eslint-disable-next-line i18next/no-literal-string */}
			<h1 className="mb-12 text-6xl text-gray-600">
				WinWinTravel frontend test task
			</h1>

			<Button
				onClick={() => setIsFilterOpen(true)}
				className="w-[280px]"
			>
				{t('openButton')}
			</Button>

			{/* Debug output of the applied filters, no design required */}
			<h2 className="mt-12 text-xl text-gray-600">{t('selectedFilters')}</h2>
			<pre className="mt-4 max-w-full overflow-x-auto text-sm">
				{JSON.stringify(selectedFilters, null, 2)}
			</pre>

			<FilterModal
				isOpen={isFilterOpen}
				onClose={() => setIsFilterOpen(false)}
			/>
		</section>
	)
}

import { FormEvent, Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/shared/ui/Button'
import { Modal } from '@/shared/ui/Modal'

import { useFilterStore } from '../model/filterStore'
import {
	hasSelectionChanged,
	toSearchRequestFilter,
	toSelectedOptions,
	toggleOption
} from '../model/selection'
import { useOpeningFilters } from '../model/useOpeningFilters'
import { ConfirmApplyDialog } from './ConfirmApplyDialog'
import { FilterGroup } from './FilterGroup'

const FORM_ID = 'filter-modal-form'

interface FilterModalProps {
	isOpen: boolean
	onClose: () => void
}

const Divider = () => <hr className="border-t-2 border-grey-200" />

const FilterModalContent = ({ onClose }: Pick<FilterModalProps, 'onClose'>) => {
	const { t } = useTranslation('filter')
	const { filterItems, isLoading, isError, isOffline, retry } =
		useOpeningFilters()
	const savedFilters = useFilterStore(state => state.selectedFilters)
	const setSelectedFilters = useFilterStore(state => state.setSelectedFilters)

	// Content is mounted only while the modal is open, so the draft is prefilled from the store on every opening
	const [selectedOptions, setSelectedOptions] = useState(() =>
		toSelectedOptions(savedFilters)
	)

	const handleToggle = (filterId: string, optionId: string) => {
		setSelectedOptions(current => toggleOption(current, filterId, optionId))
	}

	const handleClearAll = () => {
		setSelectedOptions({})
	}

	const [isConfirmOpen, setIsConfirmOpen] = useState(false)

	// Nothing to apply (and nothing to confirm) until the draft differs from the saved filters
	const canApply =
		filterItems !== undefined &&
		hasSelectionChanged(filterItems, savedFilters, selectedOptions)

	// Nothing to clear when no option is selected
	const hasSelectedOptions = Object.values(selectedOptions).some(
		optionIds => optionIds.length > 0
	)

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setIsConfirmOpen(true)
	}

	const handleConfirm = () => {
		if (filterItems) {
			setSelectedFilters(toSearchRequestFilter(filterItems, selectedOptions))
		}

		onClose()
	}

	// Keeping the old filter means dropping the draft, which happens on close
	const handleCancel = onClose

	return (
		<>
			{/* The modal body starts with the line under the header */}
			<div className="mx-4 mt-4 border-t-2 border-grey-200 sm:mx-8 sm:mt-6">
				{isLoading && (
					<div
						role="status"
						className="flex justify-center py-16"
					>
						<span
							aria-hidden="true"
							className="size-10 animate-spin rounded-full border-4 border-grey-200 border-t-brand"
						/>
						<span className="sr-only">{t('loading')}</span>
					</div>
				)}

				{/* Offline there is nothing to retry: the request resumes by itself once the connection is back */}
				{isError && (
					<div className="flex flex-col items-center gap-6 py-16 text-center">
						<p>{t(isOffline ? 'offlineError' : 'loadError')}</p>
						{!isOffline && (
							<Button
								variant="secondary"
								onClick={retry}
								className="w-[184px]"
							>
								{t('retry')}
							</Button>
						)}
					</div>
				)}

				{filterItems && (
					<form
						id={FORM_ID}
						onSubmit={handleSubmit}
						className="flex flex-col gap-8 py-4 sm:py-8"
					>
						{filterItems.map((filterItem, index) => (
							<Fragment key={filterItem.id}>
								{index > 0 && <Divider />}
								<FilterGroup
									filterItem={filterItem}
									selectedOptionIds={selectedOptions[filterItem.id] ?? []}
									onToggle={optionId => handleToggle(filterItem.id, optionId)}
								/>
							</Fragment>
						))}
					</form>
				)}
			</div>

			{/* Mobile: link and Apply in one row to save height. Desktop: Apply centered, link on the right */}
			{filterItems && (
				// Mobile: sticks to the bottom of the scrolling card; the wrapper paints the background under the side paddings
				<div className="sticky bottom-0 bg-white px-4 sm:static sm:bg-transparent sm:px-8">
					<footer className="flex flex-row-reverse items-center gap-4 border-t-2 border-grey-200 py-4 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:gap-6 sm:py-8">
						{/* The footer is outside the form so it can stay pinned on mobile; `form` links the button to it */}
						<Button
							type="submit"
							form={FORM_ID}
							disabled={!canApply}
							className="flex-1 sm:col-start-2 sm:w-[184px]"
						>
							{t('apply')}
						</Button>
						<Button
							variant="link"
							onClick={handleClearAll}
							disabled={!hasSelectedOptions}
							className="text-left sm:justify-self-end"
						>
							{t('clearAll')}
						</Button>
					</footer>
				</div>
			)}

			<ConfirmApplyDialog
				isOpen={isConfirmOpen}
				onConfirm={handleConfirm}
				onCancel={handleCancel}
			/>
		</>
	)
}

export const FilterModal = ({ isOpen, onClose }: FilterModalProps) => {
	const { t } = useTranslation('filter')

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={t('title')}
			// Mobile: a fullscreen card that scrolls itself, so the header scrolls away and the footer stays pinned.
			// Desktop: the card keeps its natural height and scrolls as a whole with the layer, 80px offsets as in the design
			overlayClassName="sm:py-20"
			className="h-full overflow-y-auto sm:mx-auto sm:h-auto sm:w-[calc(100%-32px)] sm:max-w-[1280px] sm:overflow-visible sm:rounded-2xl"
		>
			<FilterModalContent onClose={onClose} />
		</Modal>
	)
}

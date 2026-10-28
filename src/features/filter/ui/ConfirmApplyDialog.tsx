import { useTranslation } from 'react-i18next'

import { Button } from '@/shared/ui/Button'
import { Modal } from '@/shared/ui/Modal'

interface ConfirmApplyDialogProps {
	isOpen: boolean
	onConfirm: () => void
	// Closing the dialog in any other way (×, Esc, backdrop) also counts as keeping the old filter
	onCancel: () => void
}

export const ConfirmApplyDialog = ({
	isOpen,
	onConfirm,
	onCancel
}: ConfirmApplyDialogProps) => {
	const { t } = useTranslation('filter')

	return (
		<Modal
			isOpen={isOpen}
			onClose={onCancel}
			title={t('confirm.title')}
			className="mx-auto mt-[min(200px,20dvh)] w-[calc(100%-32px)] max-w-[1280px] rounded-2xl shadow-[0_2px_12px_rgb(0_0_0/0.14)]"
		>
			<div className="flex flex-col-reverse gap-4 p-4 pt-12 sm:flex-row sm:justify-center sm:gap-8 sm:p-8 sm:pt-[120px]">
				<Button
					variant="secondary"
					onClick={onCancel}
					className="w-full sm:w-[280px]"
				>
					{t('confirm.cancel')}
				</Button>
				<Button
					onClick={onConfirm}
					className="w-full sm:w-[280px]"
				>
					{t('confirm.apply')}
				</Button>
			</div>
		</Modal>
	)
}

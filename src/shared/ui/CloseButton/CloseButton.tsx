import { useTranslation } from 'react-i18next'

import CloseIcon from '@/shared/assets/icons/close.svg'
import { cn } from '@/shared/lib/cn'

interface CloseButtonProps {
	onClick: () => void
	className?: string
}

export const CloseButton = ({ onClick, className }: CloseButtonProps) => {
	const { t } = useTranslation('common')

	return (
		<button
			type="button"
			onClick={onClick}
			aria-label={t('close')}
			// Padding enlarges the click area, the negative margin keeps the icon aligned to the content edge
			className={cn('-m-2 cursor-pointer p-2', className)}
		>
			<CloseIcon
				aria-hidden="true"
				className="size-6"
			/>
		</button>
	)
}

import { MouseEvent, ReactNode, useEffect, useId, useRef } from 'react'

import { cn } from '@/shared/lib/cn'

import { CloseButton } from '../CloseButton'

interface ModalProps {
	isOpen: boolean
	onClose: () => void
	children: ReactNode
	title?: ReactNode
	// The white card with the content
	className?: string
	// The transparent fullscreen layer around the card
	overlayClassName?: string
}

// Native <dialog> gives focus trapping, Esc handling and top-layer rendering for free.
// The dialog itself is a transparent fullscreen layer that scrolls when the card is taller than the screen;
// a click on the layer around the card counts as a backdrop click
export const Modal = ({
	isOpen,
	onClose,
	children,
	title,
	className,
	overlayClassName
}: ModalProps) => {
	const dialogRef = useRef<HTMLDialogElement>(null)
	const titleId = useId()

	useEffect(() => {
		const dialog = dialogRef.current

		if (!dialog) {
			return
		}

		if (isOpen && !dialog.open) {
			// Page scroll gets locked in main.css; measure the scrollbar it hides while it is still visible.
			// Nested dialogs skip it: the page is already locked and the scrollbar is gone
			if (!document.querySelector('dialog[open]')) {
				const root = document.documentElement
				const scrollbarWidth = window.innerWidth - root.clientWidth

				root.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`)
			}

			dialog.showModal()
			// By default the first focusable element (close button) gets focus with a visible ring.
			// Focusing the dialog itself is less noisy, and the next Tab still reaches the content
			dialog.focus()
		} else if (!isOpen && dialog.open) {
			dialog.close()
		}
	}, [isOpen])

	const handleClick = (event: MouseEvent<HTMLDialogElement>) => {
		if (event.target === event.currentTarget) {
			onClose()
		}
	}

	return (
		<dialog
			ref={dialogRef}
			aria-labelledby={title ? titleId : undefined}
			onClose={onClose}
			onClick={handleClick}
			tabIndex={-1}
			className={cn(
				// Default <dialog> sizes are reset, otherwise the fullscreen layer leaves gaps
				'm-0 h-dvh max-h-none w-full max-w-none overflow-y-auto bg-transparent p-0 outline-none',
				'backdrop:bg-overlay/30 backdrop:backdrop-blur-[25px]',
				overlayClassName
			)}
		>
			{isOpen && (
				<div className={cn('bg-white text-grey-500', className)}>
					{/* An empty spacer of the close button size keeps the title centered */}
					<header className="flex items-center gap-4 px-4 pt-4 sm:px-8 sm:pt-8">
						<span
							aria-hidden="true"
							className="size-6 shrink-0"
						/>
						{title ? (
							<h2
								id={titleId}
								className="flex-1 text-center text-[28px] leading-none font-medium sm:text-[40px] sm:leading-12"
							>
								{title}
							</h2>
						) : (
							<div className="flex-1" />
						)}
						<CloseButton onClick={onClose} />
					</header>

					{children}
				</div>
			)}
		</dialog>
	)
}

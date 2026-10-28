import { InputHTMLAttributes, ReactNode } from 'react'

import { cn } from '@/shared/lib/cn'

interface CheckboxProps
	extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
	label: ReactNode
}

// Native input keeps keyboard and screen reader support, only its look is replaced.
// `w-fit` keeps the clickable area to the box and the text, even inside a stretching grid or flex cell
export const Checkbox = ({ label, className, ...props }: CheckboxProps) => (
	<label
		className={cn(
			'group flex w-fit cursor-pointer items-center gap-3 text-base leading-none text-grey-500',
			className
		)}
	>
		<span className="relative flex size-6 shrink-0 items-center justify-center">
			<input
				type="checkbox"
				className={cn(
					'peer size-5 cursor-pointer appearance-none rounded-[3px] border-2 border-grey-500 bg-white',
					'transition-colors group-hover:not-checked:bg-grey-100 checked:bg-grey-500',
					'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
				)}
				{...props}
			/>
			<svg
				viewBox="0 0 12 10"
				aria-hidden="true"
				className="pointer-events-none absolute w-3 text-white opacity-0 transition-opacity peer-checked:opacity-100"
			>
				<path
					d="M1 5l3.5 3.5L11 1"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
				/>
			</svg>
		</span>
		{label}
	</label>
)

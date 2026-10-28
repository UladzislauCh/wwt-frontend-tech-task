import { ButtonHTMLAttributes } from 'react'

import { cn } from '@/shared/lib/cn'

type ButtonVariant = 'primary' | 'secondary' | 'link'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant
}

// Solid buttons share the size from the layout: 64px height, 16px radius.
// Height is fixed because Figma trims text to cap height, so its 26px paddings don't add up to 64px in CSS
const SOLID_CLASSES = cn(
	'inline-flex h-16 items-center justify-center rounded-2xl px-6 font-semibold',
	'disabled:border-grey-100 disabled:bg-grey-100 disabled:text-grey-300'
)

// State colors come from the design system page of the layout.
// Hover and active are limited to enabled buttons, so a disabled one doesn't react
const VARIANT_CLASSES: Record<ButtonVariant, string> = {
	primary: cn(
		SOLID_CLASSES,
		'bg-brand text-white',
		'enabled:hover:bg-brand-hover enabled:active:bg-brand-active'
	),
	secondary: cn(
		SOLID_CLASSES,
		'border-2 border-grey-200 bg-white text-grey-400',
		'enabled:hover:bg-grey-100',
		'enabled:active:border-brand-active enabled:active:bg-brand-active enabled:active:text-white'
	),
	link: cn(
		'font-medium text-primary underline',
		'enabled:hover:text-grey-300 enabled:active:text-grey-500 disabled:text-grey-200'
	)
}

export const Button = ({
	variant = 'primary',
	type = 'button',
	className,
	...props
}: ButtonProps) => (
	<button
		type={type}
		className={cn(
			'cursor-pointer text-base leading-none transition-colors',
			'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
			'disabled:cursor-not-allowed',
			VARIANT_CLASSES[variant],
			className
		)}
		{...props}
	/>
)

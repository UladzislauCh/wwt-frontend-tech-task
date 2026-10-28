import { cn } from './cn'

describe('cn', () => {
	it('skips falsy values', () => {
		const isHidden = false

		expect(cn('p-2', isHidden && 'hidden', undefined)).toBe('p-2')
	})

	it('lets the later class override a conflicting one', () => {
		expect(cn('px-6 py-2', 'px-4')).toBe('py-2 px-4')
	})

	it('resolves conflicts between custom theme colors', () => {
		expect(cn('bg-brand text-white', 'bg-white')).toBe('text-white bg-white')
	})

	it('keeps font size and text color as separate groups', () => {
		expect(cn('text-base text-grey-500')).toBe('text-base text-grey-500')
	})
})

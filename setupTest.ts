// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

import { server } from '@/shared/api/mocks/node'
import '@/shared/i18n'

// jsdom doesn't implement modal dialogs, so emulate the part the app relies on
if (!HTMLDialogElement.prototype.showModal) {
	HTMLDialogElement.prototype.showModal = function showModal() {
		this.open = true
	}

	HTMLDialogElement.prototype.close = function close() {
		this.open = false
		this.dispatchEvent(new Event('close'))
	}
}

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

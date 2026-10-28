import { setupServer } from 'msw/node'

import { handlers } from './handlers'

// Same handlers as in the browser, used by tests
export const server = setupServer(...handlers)

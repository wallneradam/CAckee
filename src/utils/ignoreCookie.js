'use strict'

const COOKIE_NAME = 'ackee_ignore'

module.exports = {
	isSet: (cookie = '') => cookie.split(';').some((part) => {
		const [ key, ...rest ] = part.trim().split('=')
		return key === COOKIE_NAME && rest.join('=') === '1'
	}),
	on: {
		name: COOKIE_NAME,
		value: '1',
		options: {
			maxAge: 365 * 24 * 60 * 60,
			sameSite: 'none',
			secure: true,
		},
	},
	off: {
		name: COOKIE_NAME,
		value: '0',
		options: {
			maxAge: -1,
			sameSite: 'none',
			secure: true,
		},
	},
}
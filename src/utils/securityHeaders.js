'use strict'

// Same set helmet applies by default, without Cross-Origin-Resource-Policy
// (tracker and UI assets are loaded cross-origin) and without
// Content-Security-Policy (the generated UI contains an inline script)
const securityHeaders = {
	'Cross-Origin-Opener-Policy': 'same-origin',
	'Origin-Agent-Cluster': '?1',
	'Referrer-Policy': 'no-referrer',
	'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
	'X-Content-Type-Options': 'nosniff',
	'X-DNS-Prefetch-Control': 'off',
	'X-Download-Options': 'noopen',
	'X-Frame-Options': 'SAMEORIGIN',
	'X-Permitted-Cross-Domain-Policies': 'none',
	'X-XSS-Protection': '0',
}

module.exports = (response) => {
	for (const [ key, value ] of Object.entries(securityHeaders)) {
		response.setHeader(key, value)
	}
}

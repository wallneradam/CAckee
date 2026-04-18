'use strict'

const fullyQualifiedDomainNames = require('./fullyQualifiedDomainNames')

const findOrigin = (request, origins) => {
	return origins.find((origin) => origin === request.headers.origin)
}

module.exports = async (request, allowedOrigins, autoOrigin) => {
	if (autoOrigin === true) {
		const names = await fullyQualifiedDomainNames()
		const origins = names.flatMap((name) => [`http://${ name }`, `https://${ name }`])
		return findOrigin(request, origins)
	}

	if (allowedOrigins === '*') return '*'

	if (allowedOrigins != null) {
		const origins = allowedOrigins.split(',')
		return findOrigin(request, origins)
	}
}
'use strict'

module.exports = (url) => {
	const matches = (/^([a-z][a-z\d+.-]*:\/\/)([^/?#]*)(.*)$/i).exec(url)

	if (matches == null) {
		return url
	}

	const [ , protocol, authority, path ] = matches
	const authIndex = authority.lastIndexOf('@')

	if (authIndex === -1) {
		return url
	}

	return `${ protocol }${ authority.slice(authIndex + 1) }${ path }`
}
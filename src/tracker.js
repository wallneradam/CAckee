import platform from 'platform'

const isBrowser = typeof window !== 'undefined'
const VID_KEY = 'vid'

let memoryVid
let uaChPlatformVersion
let fontProbeWindowsVersion

const measureTextWidth = (family) => {
	const span = document.createElement('span')
	span.style.cssText = 'position:absolute;left:-9999px;top:-9999px;visibility:hidden;white-space:nowrap;font-size:72px;'
	span.style.fontFamily = family
	span.textContent = 'mmmmmmmmmmlli'
	document.body.appendChild(span)
	const width = span.offsetWidth
	document.body.removeChild(span)
	return width
}

const probeWindowsVersionByFonts = () => {
	if (typeof document === 'undefined' || document.body == null) return
	try {
		const fallbacks = [ 'monospace', 'sans-serif', 'serif' ]
		const baselines = fallbacks.map(measureTextWidth)
		const tested = fallbacks.map((fb) => measureTextWidth(`"Segoe UI Variable", ${ fb }`))
		const installed = tested.some((width, i) => width !== baselines[i])
		fontProbeWindowsVersion = installed === true ? '11' : '10'
	} catch (error) {}
}

const uaChReady = (isBrowser === true && navigator.userAgentData != null && typeof navigator.userAgentData.getHighEntropyValues === 'function')
	? navigator.userAgentData.getHighEntropyValues([ 'platformVersion' ])
		.then((ua) => {
			uaChPlatformVersion = ua.platformVersion
		})
		.catch(() => {})
	: Promise.resolve()

const domReady = isBrowser === true
	? new Promise((resolve) => {
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', () => {
				probeWindowsVersionByFonts()
				resolve()
			}, { once: true })
		} else {
			probeWindowsVersionByFonts()
			resolve()
		}
	})
	: Promise.resolve()

const trackerReady = Promise.all([ uaChReady, domReady ])

const resolveOsVersion = (osName, osVersion) => {
	if (osName !== 'Windows') return osVersion
	if (uaChPlatformVersion != null) {
		const major = parseInt(uaChPlatformVersion.split('.')[0], 10)
		if (Number.isNaN(major) === false) return major >= 13 ? '11' : '10'
	}
	if (fontProbeWindowsVersion != null) return fontProbeWindowsVersion
	return osVersion
}

const validate = (options = {}) => ({
	detailed: options.detailed === true,
	ignoreLocalhost: options.ignoreLocalhost !== false,
	ignoreOwnVisits: options.ignoreOwnVisits !== false,
})

const isLocalhost = (hostname) => {
	return hostname === '' || hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1'
}

const isBot = (userAgent) => {
	return (/bot|crawler|spider|crawling/i).test(userAgent)
}

const isFakeId = (id) => {
	return id === '88888888-8888-8888-8888-888888888888'
}

const isInBackground = () => {
	return document.visibilityState === 'hidden'
}

const source = () => {
	const value = (location.search.split('source=')[1] || '').split('&')[0]
	return value === '' ? undefined : value
}

const randomPart = () => {
	if (window.crypto != null && typeof window.crypto.getRandomValues === 'function') {
		return [ ...window.crypto.getRandomValues(new Uint8Array(16)) ]
			.map((value) => value.toString(16).padStart(2, '0'))
			.join('')
	}

	return `${ Date.now().toString(36) }${ Math.random().toString(36)
		.slice(2) }`
}

const createVid = () => {
	if (window.crypto != null && typeof window.crypto.randomUUID === 'function') {
		return window.crypto.randomUUID()
	}

	return randomPart()
}

const vid = () => {
	if (memoryVid != null) return memoryVid

	try {
		const storedVid = window.localStorage.getItem(VID_KEY)
		if (storedVid != null && storedVid !== '') {
			memoryVid = storedVid
			return memoryVid
		}

		memoryVid = createVid()
		window.localStorage.setItem(VID_KEY, memoryVid)
		return memoryVid
	} catch (error) {
		memoryVid = createVid()
		return memoryVid
	}
}

const attributes = (detailed = false) => {
	const defaultData = {
		vid: vid(),
		siteLocation: window.location.href,
		siteReferrer: document.referrer,
		source: source(),
	}

	const detailedData = {
		siteLanguage: (navigator.language || navigator.userLanguage).substr(0, 2),
		screenWidth: screen.width,
		screenHeight: screen.height,
		screenColorDepth: screen.colorDepth,
		deviceName: platform.product,
		deviceManufacturer: platform.manufacturer,
		osName: platform.os.family,
		osVersion: resolveOsVersion(platform.os.family, platform.os.version),
		browserName: platform.name,
		browserVersion: platform.version,
		browserWidth: window.outerWidth || window.innerWidth,
		browserHeight: window.outerHeight || window.innerHeight,
	}

	return {
		...defaultData,
		...(detailed === true ? detailedData : {}),
	}
}

const createRecordBody = (domainId, input) => ({
	query: `
		mutation createRecord($domainId: ID!, $input: CreateRecordInput!) {
			createRecord(domainId: $domainId, input: $input) {
				payload {
					id
				}
			}
		}
	`,
	variables: {
		domainId,
		input,
	},
})

const updateRecordBody = (recordId) => ({
	query: `
		mutation updateRecord($recordId: ID!) {
			updateRecord(id: $recordId) {
				success
			}
		}
	`,
	variables: {
		recordId,
	},
})

const createActionBody = (eventId, input) => ({
	query: `
		mutation createAction($eventId: ID!, $input: CreateActionInput!) {
			createAction(eventId: $eventId, input: $input) {
				payload {
					id
				}
			}
		}
	`,
	variables: {
		eventId,
		input,
	},
})

const updateActionBody = (actionId, input) => ({
	query: `
		mutation updateAction($actionId: ID!, $input: UpdateActionInput!) {
			updateAction(id: $actionId, input: $input) {
				success
			}
		}
	`,
	variables: {
		actionId,
		input,
	},
})

const endpoint = (server) => {
	const hasTrailingSlash = server.substr(-1) === '/'
	return server + (hasTrailingSlash === true ? '' : '/') + 'api'
}

const send = (url, body, options, next) => {
	const xhr = new XMLHttpRequest()

	xhr.open('POST', url)

	xhr.onload = () => {
		if (xhr.status !== 200) {
			throw new Error('Server returned with an unhandled status')
		}

		let json = null

		try {
			json = JSON.parse(xhr.responseText)
		} catch (error) {
			throw new Error('Failed to parse response from server')
		}

		if (json.errors != null) {
			throw new Error(json.errors[0].message)
		}

		if (typeof next === 'function') {
			return next(json)
		}
	}

	xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
	xhr.withCredentials = options.ignoreOwnVisits
	xhr.send(JSON.stringify(body))
}

const detect = () => {
	const elem = document.querySelector('[data-ackee-domain-id]')
	if (elem == null) return

	const server = elem.getAttribute('data-ackee-server') || ''
	const domainId = elem.getAttribute('data-ackee-domain-id')
	const options = elem.getAttribute('data-ackee-opts') || '{}'

	trackerReady.then(() => {
		create(server, JSON.parse(options)).record(domainId)
	})
}

const create = (server, options) => {
	options = validate(options)
	const url = endpoint(server)
	const noop = () => {}
	const fakeInstance = {
		record: () => ({ stop: noop }),
		updateRecord: () => ({ stop: noop }),
		action: noop,
		updateAction: noop,
	}

	if (options.ignoreLocalhost === true && isLocalhost(location.hostname) === true) {
		console.warn('Ackee ignores you because you are on localhost')
		return fakeInstance
	}

	if (isBot(navigator.userAgent) === true) {
		console.warn('Ackee ignores you because you are a bot')
		return fakeInstance
	}

	const _record = (domainId, attrs = attributes(options.detailed), next) => {
		let isStopped = false
		const stop = () => {
			isStopped = true
		}

		send(url, createRecordBody(domainId, attrs), options, (json) => {
			const recordId = json.data.createRecord.payload.id

			if (isFakeId(recordId) === true) {
				return console.warn('Ackee ignores you because this is your own site')
			}

			const interval = setInterval(() => {
				if (isStopped === true) {
					clearInterval(interval)
					return
				}

				if (isInBackground() === true) return

				send(url, updateRecordBody(recordId), options)
			}, 15000)

			if (typeof next === 'function') {
				return next(recordId)
			}
		})

		return { stop }
	}

	const _updateRecord = (recordId) => {
		let isStopped = false
		const stop = () => {
			isStopped = true
		}

		if (isFakeId(recordId) === true) {
			console.warn('Ackee ignores you because this is your own site')
			return { stop }
		}

		const interval = setInterval(() => {
			if (isStopped === true) {
				clearInterval(interval)
				return
			}

			if (isInBackground() === true) return

			send(url, updateRecordBody(recordId), options)
		}, 15000)

		return { stop }
	}

	const _action = (eventId, attrs, next) => {
		send(url, createActionBody(eventId, attrs), options, (json) => {
			const actionId = json.data.createAction.payload.id

			if (isFakeId(actionId) === true) {
				return console.warn('Ackee ignores you because this is your own site')
			}

			if (typeof next === 'function') {
				return next(actionId)
			}
		})
	}

	const _updateAction = (actionId, attrs) => {
		if (isFakeId(actionId) === true) {
			return console.warn('Ackee ignores you because this is your own site')
		}

		send(url, updateActionBody(actionId, attrs), options)
	}

	return {
		record: _record,
		updateRecord: _updateRecord,
		action: _action,
		updateAction: _updateAction,
	}
}

if (isBrowser === true) {
	window.ackeeTracker = {
		attributes,
		detect,
		create,
	}

	detect()
}
'use strict'

const KnownError = require('../utils/KnownError')
const messages = require('../utils/messages')
const events = require('../database/events')
const actions = require('../database/actions')
const domains = require('../database/domains')

const polish = (obj) => {
	return Object.entries(obj).reduce((acc, [ key, value ]) => {
		value = typeof value === 'string' ? value.trim() : value
		value = value == null ? undefined : value
		value = value === '' ? undefined : value

		acc[key] = value
		return acc
	}, {})
}

module.exports = {
	Mutation: {
		createAction: async (parent, { eventId, domainId, input }, { isIgnored }) => {
			// Ignore your own actions when logged in
			if (isIgnored === true) {
				return {
					success: true,
					payload: {
						id: '88888888-8888-8888-8888-888888888888',
					},
				}
			}

			const data = polish({ ...input, eventId, visitorId: input.vid, domainId })

			// The vid is only an input alias for the visitorId
			delete data.vid

			const event = await events.get(eventId)

			if (event == null) throw new KnownError('Unknown event')

			// The domainId is optional to stay compatible with trackers that
			// don't send it, but a given domain must exist
			if (data.domainId != null) {
				const domain = await domains.get(data.domainId)

				if (domain == null) throw new KnownError('Unknown domain')
			}

			let entry

			try {
				entry = await actions.add(data)
			} catch (error) {
				if (error.name === 'ValidationError') {
					throw new KnownError(messages(error.errors))
				}

				throw error
			}

			return {
				success: true,
				payload: entry,
			}
		},
		updateAction: async (parent, { id, input }, { isIgnored }) => {
			// Ignore your own actions when logged in
			if (isIgnored === true) {
				return {
					success: true,
				}
			}

			let entry

			try {
				entry = await actions.update(id, input)
			} catch (error) {
				if (error.name === 'ValidationError') {
					throw new KnownError(messages(error.errors))
				}

				throw error
			}

			if (entry == null) {
				throw new KnownError('Unknown action')
			}

			return {
				success: true,
			}
		},
	},
}
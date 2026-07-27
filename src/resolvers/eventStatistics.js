'use strict'

const actions = require('../database/actions')
const pipe = require('../utils/pipe')
const requireAuth = require('../middlewares/requireAuth')

// Actions of all domains are included when no domain is specified
const domainFilter = (domainId) => {
	return domainId == null ? null : [ domainId ]
}

module.exports = {
	EventStatistics: {
		id: pipe(requireAuth, (event) => {
			return event.id
		}),
		chart: pipe(requireAuth, (event, { type, interval, limit, domainId }, { dateDetails }) => {
			const ids = [ event.id ]
			return actions.getChart(ids, type, interval, limit, dateDetails, domainFilter(domainId))
		}),
		list: pipe(requireAuth, (event, { sorting, type, range, limit, domainId }, { dateDetails }) => {
			const ids = [ event.id ]
			return actions.getList(ids, sorting, type, range, limit, dateDetails, domainFilter(domainId))
		}),
	},
}
'use strict'

const Record = require('../models/Record')
const ranges = require('../constants/ranges')
const countryCodes = require('../utils/countryCodes')
const recursiveId = require('../utils/recursiveId')
const matchDomains = require('../stages/matchDomains')

const applyRange = (match, range, dateDetails) => {
	if (range === ranges.RANGES_LAST_24_HOURS) {
		match.created = { $gte: dateDetails.lastHours(24) }
	}

	if (range === ranges.RANGES_LAST_7_DAYS) {
		match.created = { $gte: dateDetails.lastDays(7) }
	}

	if (range === ranges.RANGES_LAST_30_DAYS) {
		match.created = { $gte: dateDetails.lastDays(30) }
	}

	if (range === ranges.RANGES_LAST_6_MONTHS) {
		match.created = { $gte: dateDetails.lastMonths(6) }
	}
}

const get = async (ids, range, limit, dateDetails) => {
	const match = matchDomains(ids)

	match.$match.siteCountry = { $exists: true, $ne: null }
	match.$match.visitorId = { $exists: true, $ne: null }
	applyRange(match.$match, range, dateDetails)

	const aggregation = [
		match,
		{
			$group: {
				_id: '$siteCountry',
				visitors: {
					$addToSet: '$visitorId',
				},
			},
		},
		{
			$project: {
				_id: '$_id',
				count: {
					$size: '$visitors',
				},
			},
		},
		{
			$sort: {
				count: -1,
				_id: 1,
			},
		},
		{
			$limit: limit,
		},
	]

	const enhance = (entries) => {
		return entries.map((entry) => {
			const code = entry._id
			const value = countryCodes[code] || code

			return {
				id: recursiveId([ code, range, ...ids ]),
				code,
				value,
				count: entry.count,
			}
		})
	}

	return enhance(await Record.aggregate(aggregation))
}

module.exports = {
	get,
}
'use strict'

const ranges = require('../constants/ranges')
const matchEvents = require('../stages/matchEvents')
const countVisitors = require('../utils/countVisitors')

module.exports = (ids, average, range, limit, dateDetails, domainIds) => {
	const aggregation = [
		matchEvents(ids, domainIds),
		{
			$group: {
				_id: {
					key: '$key',
				},
				visitors: {
					$addToSet: '$visitorId',
				},
			},
		},
		{
			$project: {
				_id: '$_id',
				count: '$count',
				visitors: countVisitors,
			},
		},
		{
			$sort: {
				count: -1,
			},
		},
		{
			$limit: limit,
		},
	]

	aggregation[0].$match.key = { $ne: null }
	aggregation[1].$group.count = average === true ? { $avg: '$value' } : { $sum: '$value' }

	if (range === ranges.RANGES_LAST_24_HOURS) {
		aggregation[0].$match.created = { $gte: dateDetails.lastHours(24) }
	}

	if (range === ranges.RANGES_LAST_7_DAYS) {
		aggregation[0].$match.created = { $gte: dateDetails.lastDays(7) }
	}

	if (range === ranges.RANGES_LAST_30_DAYS) {
		aggregation[0].$match.created = { $gte: dateDetails.lastDays(30) }
	}

	if (range === ranges.RANGES_LAST_6_MONTHS) {
		aggregation[0].$match.created = { $gte: dateDetails.lastMonths(6) }
	}

	return aggregation
}
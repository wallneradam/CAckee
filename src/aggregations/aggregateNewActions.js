'use strict'

const matchEvents = require('../stages/matchEvents')
const countVisitors = require('../utils/countVisitors')

module.exports = (ids, limit, domainIds) => {
	const aggregation = [
		matchEvents(ids, domainIds),
		{
			$group: {
				_id: {
					key: '$key',
				},
				count: {
					$sum: '$value',
				},
				created: {
					$first: '$created',
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
				created: '$created',
				visitors: countVisitors,
			},
		},
		{
			$sort: {
				created: -1,
			},
		},
		{
			$limit: limit,
		},
	]

	aggregation[0].$match.key = { $ne: null }

	return aggregation
}
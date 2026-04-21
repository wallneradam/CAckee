'use strict'

const matchDomains = require('../stages/matchDomains')

module.exports = (ids, properties, limit, or) => {
	const aggregation = [
		matchDomains(ids),
		{
			$group: {
				_id: {},
				count: {
					$sum: 1,
				},
				created: {
					$first: '$created',
				},
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

	const sizeProperties = new Set([ 'browserWidth', 'browserHeight', 'screenWidth', 'screenHeight' ])

	properties.forEach((property) => {
		const condition = sizeProperties.has(property) === true ? { $gt: 0 } : { $ne: null }
		if (or === true) {
			aggregation[0].$match['$or'] = [
				...(aggregation[0].$match['$or'] || []),
				{ [property]: condition },
			]
		} else {
			aggregation[0].$match[property] = condition
		}
		aggregation[1].$group._id[property] = `$${ property }`
	})

	return aggregation
}
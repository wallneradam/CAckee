'use strict'

const matchDomains = require('../stages/matchDomains')

module.exports = (ids, properties, limit, or) => {
	const aggregation = [
		matchDomains(ids),
		{
			$sort: {
				created: -1,
			},
		},
		{
			$project: {
				_id: {},
				created: '$created',
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
		aggregation[2].$project._id[property] = `$${ property }`
	})

	return aggregation
}
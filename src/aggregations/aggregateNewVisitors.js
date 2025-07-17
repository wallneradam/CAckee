'use strict'

const intervals = require('../constants/intervals')
const matchDomains = require('../stages/matchDomains')

module.exports = (ids, interval, limit, dateDetails) => {
	const currentPeriodStart = dateDetails.includeFnByInterval(interval)(limit)

	const aggregation = [
		matchDomains(ids),
		{
			$match: {
				// Only records that are new visitor sessions
				isNewVisitorSession: true,
			},
		},
		{
			$group: {
				_id: {},
				newVisitors: { $addToSet: '$visitorId' },
			},
		},
		{
			$project: {
				_id: '$_id',
				count: { $size: '$newVisitors' },
			},
		},
	]

	aggregation[0].$match.visitorId = { $exists: true, $ne: null }
	aggregation[0].$match.created = { $gte: currentPeriodStart }

	const dateExpression = { date: '$created', timezone: dateDetails.userTimeZone }
	const matchDay = [ intervals.INTERVALS_DAILY ].includes(interval)
	const matchWeek = [ intervals.INTERVALS_DAILY, intervals.INTERVALS_WEEKLY ].includes(interval)
	const matchYear = [ intervals.INTERVALS_DAILY, intervals.INTERVALS_WEEKLY, intervals.INTERVALS_YEARLY ].includes(interval)

	if (matchDay === true) aggregation[2].$group._id.day = { $dayOfMonth: dateExpression }
	if (matchWeek === true) aggregation[2].$group._id.week = { $week: dateExpression }
	if (matchYear === true) aggregation[2].$group._id.year = { $year: dateExpression }

	return aggregation
}
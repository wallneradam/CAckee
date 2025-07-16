'use strict'

const intervals = require('../constants/intervals')
const matchDomains = require('../stages/matchDomains')

module.exports = (ids, interval, limit, dateDetails) => {
        const aggregation = [
                matchDomains(ids),
                {
                        $group: {
                                _id: {},
                                visitors: { $addToSet: '$visitorId' },
                        },
                },
                {
                        $project: {
                                _id: '$_id',
                                count: { $size: '$visitors' },
                        },
                },
        ]

        aggregation[0].$match.visitorId = { $exists: true, $ne: null }
        aggregation[0].$match.created = { $gte: dateDetails.includeFnByInterval(interval)(limit) }

        const dateExpression = { date: '$created', timezone: dateDetails.userTimeZone }
        const matchDay = [ intervals.INTERVALS_DAILY ].includes(interval)
        const matchWeek = [ intervals.INTERVALS_DAILY, intervals.INTERVALS_WEEKLY ].includes(interval)
        const matchYear = [ intervals.INTERVALS_DAILY, intervals.INTERVALS_WEEKLY, intervals.INTERVALS_YEARLY ].includes(interval)

        if (matchDay === true) aggregation[1].$group._id.day = { $dayOfMonth: dateExpression }
        if (matchWeek === true) aggregation[1].$group._id.week = { $week: dateExpression }
        if (matchYear === true) aggregation[1].$group._id.year = { $year: dateExpression }

        return aggregation
}

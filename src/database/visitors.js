'use strict'

const { utcToZonedTime } = require('date-fns-tz')
const { getISOWeek } = require('date-fns')

const Record = require('../models/Record')
const aggregateVisitors = require('../aggregations/aggregateVisitors')
const intervals = require('../constants/intervals')
const createArray = require('../utils/createArray')
const recursiveId = require('../utils/recursiveId')

const get = async (ids, interval, limit, dateDetails) => {
        const aggregation = aggregateVisitors(ids, interval, limit, dateDetails)

        const enhance = (entries) => {
                const matchDay = [ intervals.INTERVALS_DAILY ].includes(interval)
                const matchWeek = [ intervals.INTERVALS_DAILY, intervals.INTERVALS_WEEKLY ].includes(interval)
                const matchYear = [ intervals.INTERVALS_DAILY, intervals.INTERVALS_WEEKLY, intervals.INTERVALS_YEARLY ].includes(interval)

                return createArray(limit).map((_, index) => {
                        const date = dateDetails.lastFnByInterval(interval)(index)
                        const userZonedDate = utcToZonedTime(date, dateDetails.userTimeZone)
                        const entry = entries.find((entry) => {
                                const dayOk = matchDay !== true || entry._id.day === userZonedDate.getDate()
                                const weekOk = matchWeek !== true || entry._id.week === getISOWeek(userZonedDate)
                                const yearOk = matchYear !== true || entry._id.year === userZonedDate.getFullYear()
                                return dayOk && weekOk && yearOk
                        })

                        const value = (() => {
                                if (matchDay === true) return `${ date.getFullYear() }-${ date.getMonth() + 1 }-${ date.getDate() }`
                                if (matchWeek === true) return `${ date.getFullYear() }-W${ getISOWeek(date) }`
                                if (matchYear === true) return `${ date.getFullYear() }`
                        })()

                        return {
                                id: recursiveId([ value, ...ids ]),
                                value,
                                count: entry == null ? 0 : entry.count,
                        }
                })
        }

        return enhance(await Record.aggregate(aggregation))
}

module.exports = {
        get,
}

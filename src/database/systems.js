'use strict'

const Record = require('../models/Record')
const aggregateTopRecords = require('../aggregations/aggregateTopRecords')
const aggregateNewRecords = require('../aggregations/aggregateNewRecords')
const aggregateRecentRecords = require('../aggregations/aggregateRecentRecords')
const sortings = require('../constants/sortings')
const constants = require('../constants/systems')
const recursiveId = require('../utils/recursiveId')

const LINUX_FAMILY = [ 'Linux', 'Ubuntu', 'Fedora', 'Linux aarch64', 'Linux i686', 'Linux armv7l' ]

const get = async (ids, sorting, type, range, limit, dateDetails) => {
	const aggregation = (() => {
		if (type === constants.SYSTEMS_TYPE_NO_VERSION) {
			if (sorting === sortings.SORTINGS_TOP) return aggregateTopRecords(ids, [ 'osName' ], range, limit, dateDetails)
			if (sorting === sortings.SORTINGS_NEW) return aggregateNewRecords(ids, [ 'osName' ], limit)
			if (sorting === sortings.SORTINGS_RECENT) return aggregateRecentRecords(ids, [ 'osName' ], limit)
		}
		if (type === constants.SYSTEMS_TYPE_WITH_VERSION) {
			if (sorting === sortings.SORTINGS_TOP) return aggregateTopRecords(ids, [ 'osName', 'osVersion' ], range, limit, dateDetails)
			if (sorting === sortings.SORTINGS_NEW) return aggregateNewRecords(ids, [ 'osName', 'osVersion' ], limit)
			if (sorting === sortings.SORTINGS_RECENT) return aggregateRecentRecords(ids, [ 'osName', 'osVersion' ], limit)
		}
	})()

	const groupIdx = aggregation.findIndex((stage) => stage.$group != null)
	if (groupIdx > 0) {
		aggregation.splice(groupIdx, 0, {
			$set: {
				osName: {
					$cond: [
						{ $in: [ '$osName', LINUX_FAMILY ] },
						'Linux',
						'$osName',
					],
				},
			},
		})
	}

	const enhanceId = (id) => {
		if (type === constants.SYSTEMS_TYPE_NO_VERSION) return `${ id.osName }`
		if (type === constants.SYSTEMS_TYPE_WITH_VERSION) return `${ id.osName } ${ id.osVersion }`.trim()
	}

	const enhance = (entries) => {
		return entries.map((entry) => {
			const value = enhanceId(entry._id)

			return {
				id: recursiveId([ value, sorting, type, range, ...ids ]),
				value,
				count: entry.count,
				created: entry.created,
			}
		})
	}

	return enhance(
		await Record.aggregate(aggregation),
	)
}

module.exports = {
	get,
}
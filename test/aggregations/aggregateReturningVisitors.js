import test from 'ava'

import aggregateReturningVisitors from '../../src/aggregations/aggregateReturningVisitors'
import aggregateNewVisitors from '../../src/aggregations/aggregateNewVisitors'
import intervals from '../../src/constants/intervals'

test('return aggregation for returning visitors', (t) => {
	const ids = [ '507f1f77bcf86cd799439011' ]
	const interval = intervals.INTERVALS_DAILY
	const limit = 5
	const dateDetails = {
		userTimeZone: 'Europe/Vienna',
		includeFnByInterval: () => () => new Date('2018-01-01T00:00:00.000Z'),
	}

	const result = aggregateReturningVisitors(ids, interval, limit, dateDetails)

	t.true(Array.isArray(result))
	t.is(result.length, 5)
	t.is(result[0].$match.domainId.$in[0], '507f1f77bcf86cd799439011')
	t.is(result[0].$match.visitorId.$exists, true)
	t.is(result[0].$match.visitorId.$ne, null)
	t.is(typeof result[1].$group._id, 'object')
	t.is(typeof result[2].$match, 'object')
	t.is(typeof result[3].$group, 'object')
	t.is(typeof result[4].$project, 'object')
	// Check for 30-minute threshold logic
	t.is(typeof result[2].$match.$expr.$and, 'object')
	t.is(result[2].$match.$expr.$and.length, 2)
})

test('return aggregation for new visitors', (t) => {
	const ids = [ '507f1f77bcf86cd799439011' ]
	const interval = intervals.INTERVALS_DAILY
	const limit = 5
	const dateDetails = {
		userTimeZone: 'Europe/Vienna',
		includeFnByInterval: () => () => new Date('2018-01-01T00:00:00.000Z'),
	}

	const result = aggregateNewVisitors(ids, interval, limit, dateDetails)

	t.true(Array.isArray(result))
	t.is(result.length, 5)
	t.is(result[0].$match.domainId.$in[0], '507f1f77bcf86cd799439011')
	t.is(result[0].$match.visitorId.$exists, true)
	t.is(result[0].$match.visitorId.$ne, null)
	t.is(typeof result[1].$group._id, 'object')
	t.is(typeof result[2].$match, 'object')
	t.is(typeof result[3].$group, 'object')
	t.is(typeof result[4].$project, 'object')
	// Check for 30-minute threshold logic
	t.is(typeof result[2].$match.$expr.$and, 'object')
	t.is(result[2].$match.$expr.$and.length, 2)
})

test('return aggregation for returning visitors with weekly interval', (t) => {
	const ids = [ '507f1f77bcf86cd799439011' ]
	const interval = intervals.INTERVALS_WEEKLY
	const limit = 5
	const dateDetails = {
		userTimeZone: 'Europe/Vienna',
		includeFnByInterval: () => () => new Date('2018-01-01T00:00:00.000Z'),
	}

	const result = aggregateReturningVisitors(ids, interval, limit, dateDetails)

	t.true(Array.isArray(result))
	t.is(result.length, 5)
	t.is(typeof result[4].$group._id.week, 'object')
})
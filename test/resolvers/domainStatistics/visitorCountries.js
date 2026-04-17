'use strict'

const test = require('ava')
const listen = require('test-listen')

const server = require('../../../src/server')
const Record = require('../../../src/models/Record')
const { day } = require('../../../src/utils/times')
const { connectToDatabase, fillDatabase, cleanupDatabase, disconnectFromDatabase, api } = require('../_utils')
const { getStats } = require('./_utils')

const base = listen(server)

test.before(connectToDatabase)
test.after.always(disconnectFromDatabase)
test.beforeEach(fillDatabase)
test.afterEach.always(async (t) => {
	await cleanupDatabase(t)
	await Record.deleteMany({})
})

const createRecord = (domainId, visitorId, siteCountry, created) => ({
	domainId,
	visitorId,
	siteCountry,
	siteLocation: 'https://example.com/',
	created,
	updated: created,
})

test.serial('fetch visitor countries for a domain', async (t) => {
	const now = Date.now()

	await Record.insertMany([
		createRecord(t.context.domain.id, 'visitor-a', 'US', new Date(now - day)),
		createRecord(t.context.domain.id, 'visitor-a', 'US', new Date(now - day / 2)),
		createRecord(t.context.domain.id, 'visitor-b', 'CA', new Date(now - day)),
	])

	const statistics = await getStats({
		base,
		token: t.context.token.id,
		domainId: t.context.domain.id,
		fragment: `
			visitorCountries(range: LAST_7_DAYS) {
				code
				value
				count
			}
		`,
	})

	t.deepEqual(statistics.visitorCountries, [
		{
			code: 'CA',
			value: 'Canada',
			count: 1,
		},
		{
			code: 'US',
			value: 'United States',
			count: 1,
		},
	])
})

test.serial('fetch merged visitor countries', async (t) => {
	const now = Date.now()

	await Record.insertMany([
		createRecord(t.context.domain.id, 'visitor-a', 'US', new Date(now - day)),
		createRecord(t.context.domain.id, 'visitor-b', 'US', new Date(now - day)),
	])

	const body = {
		query: `
			query fetchStatistics {
				statistics {
					visitorCountries(range: LAST_7_DAYS) {
						code
						value
						count
					}
				}
			}
		`,
	}

	const { json } = await api(await base, body, t.context.token.id)

	t.is(json.errors, undefined)
	t.deepEqual(json.data.statistics.visitorCountries, [
		{
			code: 'US',
			value: 'United States',
			count: 2,
		},
	])
})
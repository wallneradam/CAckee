'use strict'

const test = require('ava')

const Domain = require('../../src/models/Domain')
const Record = require('../../src/models/Record')
const visitorCountries = require('../../src/database/visitorCountries')
const createDate = require('../../src/utils/createDate')
const { day } = require('../../src/utils/times')
const { connectToDatabase, disconnectFromDatabase } = require('../resolvers/_utils')

test.before(connectToDatabase)
test.after.always(disconnectFromDatabase)
test.beforeEach(async (t) => {
	t.context.primaryDomain = await Domain.create({ title: 'Primary' })
	t.context.secondaryDomain = await Domain.create({ title: 'Secondary' })
})
test.afterEach.always(async () => {
	await Record.deleteMany({})
	await Domain.deleteMany({})
})

const createRecord = (domainId, visitorId, siteCountry, created) => ({
	domainId,
	visitorId,
	siteCountry,
	siteLocation: 'https://example.com/',
	created,
	updated: created,
})

test.serial('counts unique visitors by country across domains', async (t) => {
	const now = Date.now()

	await Record.insertMany([
		createRecord(t.context.primaryDomain.id, 'visitor-a', 'US', new Date(now - day)),
		createRecord(t.context.primaryDomain.id, 'visitor-a', 'US', new Date(now - day / 2)),
		createRecord(t.context.primaryDomain.id, 'visitor-b', 'CA', new Date(now - day)),
		createRecord(t.context.secondaryDomain.id, 'visitor-c', 'CA', new Date(now - day)),
		createRecord(t.context.secondaryDomain.id, 'visitor-d', 'DE', new Date(now - day)),
	])

	const result = await visitorCountries.get([
		t.context.primaryDomain.id,
		t.context.secondaryDomain.id,
	], 'LAST_7_DAYS', 250, createDate())

	t.deepEqual(result.map((country) => ({
		code: country.code,
		value: country.value,
		count: country.count,
	})), [
		{
			code: 'CA',
			value: 'Canada',
			count: 2,
		},
		{
			code: 'DE',
			value: 'Germany',
			count: 1,
		},
		{
			code: 'US',
			value: 'United States',
			count: 1,
		},
	])
})

test.serial('filters by range and ignores incomplete visitor country data', async (t) => {
	const now = Date.now()

	await Record.insertMany([
		createRecord(t.context.primaryDomain.id, 'visitor-a', 'US', new Date(now - 2 * day)),
		createRecord(t.context.primaryDomain.id, 'visitor-b', 'GB', new Date(now - 40 * day)),
		createRecord(t.context.primaryDomain.id, undefined, 'CA', new Date(now - day)),
		createRecord(t.context.primaryDomain.id, 'visitor-c', undefined, new Date(now - day)),
	])

	const result = await visitorCountries.get([
		t.context.primaryDomain.id,
	], 'LAST_30_DAYS', 250, createDate())

	t.is(result.length, 1)
	t.is(result[0].code, 'US')
	t.is(result[0].count, 1)
})
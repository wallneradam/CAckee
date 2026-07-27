'use strict'

const test = require('ava')
const listen = require('test-listen')
const uuid = require('uuid').v4

const server = require('../../../src/server')
const { connectToDatabase, fillDatabase, cleanupDatabase, disconnectFromDatabase, api } = require('../_utils')
const { getStats } = require('./_utils')

const base = listen(server)

test.before(connectToDatabase)
test.after.always(disconnectFromDatabase)
test.beforeEach(fillDatabase)
test.afterEach.always(cleanupDatabase)

const createAction = async (t, key, vid) => {
	const body = {
		query: `
			mutation createAction($eventId: ID!, $domainId: ID, $input: CreateActionInput!) {
				createAction(eventId: $eventId, domainId: $domainId, input: $input) {
					success
				}
			}
		`,
		variables: {
			eventId: t.context.event.id,
			domainId: t.context.domain.id,
			input: {
				vid,
				key,
				value: 1,
			},
		},
	}

	const { json } = await api(base, body, t.context.token.id)

	if (json.errors != null) throw new Error(json.errors[0].message)
}

test.serial('count unique visitors of a key and filter by domain', async (t) => {
	const key = uuid()

	// The same visitor triggers the event twice, a second one only once
	await createAction(t, key, 'visitor-a')
	await createAction(t, key, 'visitor-a')
	await createAction(t, key, 'visitor-b')

	const statistics = await getStats({
		base,
		token: t.context.token.id,
		eventId: t.context.event.id,
		fragment: `
			list(sorting: TOP, type: TOTAL, range: LAST_6_MONTHS, domainId: "${ t.context.domain.id }") {
				value
				count
				visitors
			}
		`,
	})

	// The seeded actions carry no domainId and must be filtered out
	t.is(statistics.list.length, 1)
	t.is(statistics.list[0].value, key)
	t.is(statistics.list[0].count, 3)
	t.is(statistics.list[0].visitors, 2)
})

test.serial('exclude actions without a visitor from the visitor count', async (t) => {
	const statistics = await getStats({
		base,
		token: t.context.token.id,
		eventId: t.context.event.id,
		fragment: `
			list(sorting: TOP, type: TOTAL, range: LAST_6_MONTHS) {
				value
				count
				visitors
			}
		`,
	})

	const entry = statistics.list.find((item) => item.value === 'Key 14')

	t.is(entry.count, 14)
	t.is(entry.visitors, 0)
})

test.serial('count unique visitors in the chart', async (t) => {
	const key = uuid()

	await createAction(t, key, 'visitor-a')
	await createAction(t, key, 'visitor-a')
	await createAction(t, key, 'visitor-b')

	const statistics = await getStats({
		base,
		token: t.context.token.id,
		eventId: t.context.event.id,
		fragment: `
			chart(interval: DAILY, type: TOTAL, limit: 1, domainId: "${ t.context.domain.id }") {
				count
				visitors
			}
		`,
	})

	t.is(statistics.chart.length, 1)
	t.is(statistics.chart[0].count, 3)
	t.is(statistics.chart[0].visitors, 2)
})

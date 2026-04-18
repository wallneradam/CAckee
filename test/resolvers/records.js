'use strict'

const test = require('ava')
const listen = require('test-listen')

const server = require('../../src/server')
const { connectToDatabase, fillDatabase, cleanupDatabase, disconnectFromDatabase, api } = require('./_utils')
const Record = require('../../src/models/Record')
const { minute } = require('../../src/utils/times')

const base = listen(server)

let validRecord
let ignoredRecord

test.before(connectToDatabase)
test.after.always(disconnectFromDatabase)
test.beforeEach(fillDatabase)
test.afterEach.always(cleanupDatabase)

test.serial('reject record creation without vid', async (t) => {
	const body = {
		query: `
			mutation createRecord($domainId: ID!, $input: CreateRecordInput!) {
				createRecord(domainId: $domainId, input: $input) {
					success
				}
			}
		`,
		variables: {
			domainId: t.context.domain.id,
			input: {
				siteLocation: 'https://example.com/',
			},
		},
	}

	const { json } = await api(base, body, t.context.token.id)

	t.truthy(json.errors)
	t.true(json.errors[0].message.includes('vid'))
})

test.serial('create record', async (t) => {
	const body = {
		query: `
			mutation createRecord($domainId: ID!, $input: CreateRecordInput!) {
				createRecord(domainId: $domainId, input: $input) {
					success
					payload {
						id
					}
				}
			}
		`,
		variables: {
			domainId: t.context.domain.id,
			input: {
				vid: 'test-vid',
				siteLocation: 'https://example.com/',
				siteReferrer: 'https://google.com/',
			},
		},
	}

	const { json } = await api(base, body, t.context.token.id)

	t.true(json.data.createRecord.success)
	t.is(typeof json.data.createRecord.payload.id, 'string')

	const record = await Record.findOne({ id: json.data.createRecord.payload.id })
	t.is(record.visitorId, 'test-vid')
	t.is(record.isNewVisitorSession, true)

	// Save record for the next test
	validRecord = json.data.createRecord.payload
})

test.serial('classify repeated vid within 30 minutes as new visitor session', async (t) => {
	const body = {
		query: `
			mutation createRecord($domainId: ID!, $input: CreateRecordInput!) {
				createRecord(domainId: $domainId, input: $input) {
					payload {
						id
					}
				}
			}
		`,
		variables: {
			domainId: t.context.domain.id,
			input: {
				vid: 'repeat-vid',
				siteLocation: 'https://example.com/',
			},
		},
	}

	await api(base, body, t.context.token.id)
	const { json } = await api(base, body, t.context.token.id)
	const record = await Record.findOne({ id: json.data.createRecord.payload.id })

	t.is(record.isNewVisitorSession, true)
})

test.serial('classify repeated vid after 30 minutes as returning visitor session', async (t) => {
	const body = {
		query: `
			mutation createRecord($domainId: ID!, $input: CreateRecordInput!) {
				createRecord(domainId: $domainId, input: $input) {
					payload {
						id
					}
				}
			}
		`,
		variables: {
			domainId: t.context.domain.id,
			input: {
				vid: 'returning-vid',
				siteLocation: 'https://example.com/',
			},
		},
	}

	const first = await api(base, body, t.context.token.id)
	await Record.findOneAndUpdate({
		id: first.json.data.createRecord.payload.id,
	}, {
		$set: {
			created: new Date(Date.now() - 31 * minute),
		},
	})

	const { json } = await api(base, body, t.context.token.id)
	const record = await Record.findOne({ id: json.data.createRecord.payload.id })

	t.is(record.isNewVisitorSession, false)
})

test.serial('update record', async (t) => {
	const body = {
		query: `
			mutation updateRecord($id: ID!) {
				updateRecord(id: $id) {
					success
				}
			}
		`,
		variables: {
			id: validRecord.id,
		},
	}

	const { json } = await api(base, body, t.context.token.id)

	t.true(json.data.updateRecord.success)
})

test.serial('ignore record creation when logged in', async (t) => {
	const body = {
		query: `
			mutation createRecord($domainId: ID!, $input: CreateRecordInput!) {
				createRecord(domainId: $domainId, input: $input) {
					success
					payload {
						id
					}
				}
			}
		`,
		variables: {
			domainId: t.context.domain.id,
			input: {
				vid: 'ignored-vid',
				siteLocation: 'https://example.com/',
			},
		},
	}

	const { json } = await api(base, body, t.context.token.id, {
		Cookie: 'ackee_ignore=1',
	})

	t.true(json.data.createRecord.success)
	t.is(json.data.createRecord.payload.id, '88888888-8888-8888-8888-888888888888')

	// Save record for the next test
	ignoredRecord = json.data.createRecord.payload
})

test.serial('ignore record update when logged in', async (t) => {
	const body = {
		query: `
			mutation updateRecord($id: ID!) {
				updateRecord(id: $id) {
					success
				}
			}
		`,
		variables: {
			id: ignoredRecord.id,
		},
	}

	const { json } = await api(base, body, t.context.token.id, {
		Cookie: 'ackee_ignore=1',
	})

	t.true(json.data.updateRecord.success)
})
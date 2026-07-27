'use strict'

const test = require('ava')
const listen = require('test-listen')
const uuid = require('uuid').v4

const server = require('../../src/server')
const Action = require('../../src/models/Action')
const { connectToDatabase, fillDatabase, cleanupDatabase, disconnectFromDatabase, api } = require('./_utils')

const base = listen(server)

let validAction
let ignoredAction

const defaultKey = uuid()
const defaultValue = 1
const updatedKey = uuid()
const updatedValue = null

test.before(connectToDatabase)
test.after.always(disconnectFromDatabase)
test.beforeEach(fillDatabase)
test.afterEach.always(cleanupDatabase)

test.serial('create action', async (t) => {
	const body = {
		query: `
			mutation createAction($eventId: ID!, $input: CreateActionInput!) {
				createAction(eventId: $eventId, input: $input) {
					success
					payload {
						id
						key
						value
					}
				}
			}
		`,
		variables: {
			eventId: t.context.event.id,
			input: {
				key: defaultKey,
				value: defaultValue,
			},
		},
	}

	const { json } = await api(base, body, t.context.token.id)

	t.true(json.data.createAction.success)
	t.is(typeof json.data.createAction.payload.id, 'string')
	t.is(json.data.createAction.payload.key, defaultKey)
	t.is(json.data.createAction.payload.value, defaultValue)

	// Save action for the next test
	validAction = json.data.createAction.payload
})

test.serial('update action', async (t) => {
	const body = {
		query: `
			mutation updateAction($id: ID!, $input: UpdateActionInput!) {
				updateAction(id: $id, input: $input) {
					success
				}
			}
		`,
		variables: {
			id: validAction.id,
			input: {
				key: updatedKey,
				value: updatedValue,
			},
		},
	}

	const { json } = await api(base, body, t.context.token.id)

	t.true(json.data.updateAction.success)
})

test.serial('create action with vid and domainId', async (t) => {
	const key = uuid()

	const body = {
		query: `
			mutation createAction($eventId: ID!, $domainId: ID, $input: CreateActionInput!) {
				createAction(eventId: $eventId, domainId: $domainId, input: $input) {
					success
					payload {
						id
					}
				}
			}
		`,
		variables: {
			eventId: t.context.event.id,
			domainId: t.context.domain.id,
			input: {
				vid: 'test-vid',
				key,
				value: 1,
			},
		},
	}

	const { json } = await api(base, body, t.context.token.id)

	t.true(json.data.createAction.success)

	const action = await Action.findOne({
		id: json.data.createAction.payload.id,
	})

	t.is(action.visitorId, 'test-vid')
	t.is(action.domainId, t.context.domain.id)
})

test.serial('reject action creation with unknown domain', async (t) => {
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
			domainId: uuid(),
			input: {
				vid: 'test-vid',
				key: uuid(),
				value: 1,
			},
		},
	}

	const { json } = await api(base, body, t.context.token.id)

	t.truthy(json.errors)
	t.is(json.errors[0].message, 'Unknown domain')
})

test.serial('ignore action creation when logged in', async (t) => {
	const body = {
		query: `
			mutation createAction($eventId: ID!, $input: CreateActionInput!) {
				createAction(eventId: $eventId, input: $input) {
					success
					payload {
						id
					}
				}
			}
		`,
		variables: {
			eventId: t.context.event.id,
			input: {
				key: uuid(),
			},
		},
	}

	const { json } = await api(base, body, t.context.token.id, {
		Cookie: 'ackee_ignore=1',
	})

	t.true(json.data.createAction.success)
	t.is(json.data.createAction.payload.id, '88888888-8888-8888-8888-888888888888')

	// Save action for the next test
	ignoredAction = json.data.createAction.payload
})

test.serial('ignore action update when logged in', async (t) => {
	const body = {
		query: `
			mutation updateAction($id: ID!, $input: UpdateActionInput!) {
				updateAction(id: $id, input: $input) {
					success
				}
			}
		`,
		variables: {
			id: ignoredAction.id,
			input: {
				key: uuid(),
			},
		},
	}

	const { json } = await api(base, body, t.context.token.id, {
		Cookie: 'ackee_ignore=1',
	})

	t.true(json.data.updateAction.success)
})
'use strict'

const test = require('ava')

const stripUrlAuth = require('../../src/utils/stripUrlAuth')

test('remove user and password', (t) => {
	const url = 'mongodb://username:password@host:3000/database'
	const result = 'mongodb://host:3000/database'

	t.is(stripUrlAuth(url), result)
})

test('remove user and password from srv connection string', (t) => {
	const url = 'mongodb+srv://username:password@host/database'
	const result = 'mongodb+srv://host/database'

	t.is(stripUrlAuth(url), result)
})

test('remove user and password from replica set connection string', (t) => {
	const url = 'mongodb://username:password@host-a:27017,host-b:27017/database?replicaSet=rs'
	const result = 'mongodb://host-a:27017,host-b:27017/database?replicaSet=rs'

	t.is(stripUrlAuth(url), result)
})

test('do nothing without username or password', (t) => {
	const url = 'mongodb://host:3000/database'

	t.is(stripUrlAuth(url), url)
})

test('do nothing without username or password in srv connection string', (t) => {
	const url = 'mongodb+srv://host/database'

	t.is(stripUrlAuth(url), url)
})
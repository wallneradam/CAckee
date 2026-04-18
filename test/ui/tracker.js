'use strict'

const test = require('ava')

const { tracker } = require('../../src/ui')

test('tracker includes vid in record payload support', async (t) => {
	const script = await tracker()

	t.true(script.includes('vid'))
	t.true(script.includes('localStorage'))
	t.true(script.includes('createRecord'))
})
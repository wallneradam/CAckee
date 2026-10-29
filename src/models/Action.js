'use strict'

const mongoose = require('mongoose')
const uuid = require('uuid').v4

const schema = new mongoose.Schema({
	id: {
		type: String,
		required: true,
		unique: true,
		default: uuid,
	},
	eventId: {
		type: String,
		required: true,
		index: true,
	},
	visitorId: {
		type: String,
		index: true,
	},
	domainId: {
		type: String,
		index: true,
	},
	key: {
		type: String,
		maxlength: 500,
	},
	value: {
		type: Number,
		// Only required on creation, updates may reset the value using null
		required() {
			return this.isNew === true
		},
	},
	details: {
		type: String,
		maxlength: 2000,
	},
	created: {
		type: Date,
		required: true,
		index: true,
		default: Date.now,
	},
	updated: {
		type: Date,
		required: true,
		index: true,
		default: Date.now,
	},
})

module.exports = mongoose.model('Action', schema)
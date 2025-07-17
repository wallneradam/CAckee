'use strict'

const Record = require('../models/Record')

const response = (entry) => ({
	id: entry.id,
	siteLocation: entry.siteLocation,
	siteReferrer: entry.siteReferrer,
	siteLanguage: entry.siteLanguage,
	source: entry.source,
	screenWidth: entry.screenWidth,
	screenHeight: entry.screenHeight,
	screenColorDepth: entry.screenColorDepth,
	deviceName: entry.deviceName,
	deviceManufacturer: entry.deviceManufacturer,
	osName: entry.osName,
	osVersion: entry.osVersion,
	browserName: entry.browserName,
	browserVersion: entry.browserVersion,
	browserWidth: entry.browserWidth,
	browserHeight: entry.browserHeight,
	created: entry.created,
	updated: entry.updated,
})

const add = async (data) => {
	const enhance = (entry) => {
		return entry == null ? entry : response(entry)
	}

	// Determine if this is a new visitor session
	const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
	const now = new Date()
	let isNewVisitorSession = true

	if (data.visitorId) {
		// Check if visitor exists and get their first visit time
		const visitorFirstRecord = await Record.findOne({
			visitorId: data.visitorId
		}).sort({ created: 1 })

		if (visitorFirstRecord) {
			// Visitor already exists, check if still within session timeout
			const timeSinceFirst = now - visitorFirstRecord.created
			isNewVisitorSession = timeSinceFirst > SESSION_TIMEOUT
			console.log(`[DEBUG] Visitor ${data.visitorId}: timeSinceFirst=${timeSinceFirst}ms, SESSION_TIMEOUT=${SESSION_TIMEOUT}ms, isNewVisitorSession=${isNewVisitorSession}`)
		} else {
			console.log(`[DEBUG] Visitor ${data.visitorId}: First time visitor, isNewVisitorSession=true`)
		}
		// If no previous record found, remains true (new visitor)
	}

	console.log(`[DEBUG] Creating record with isNewVisitorSession=${isNewVisitorSession}`)
	
	return enhance(
                await Record.create({
                        clientId: data.clientId,
                        visitorId: data.visitorId,
                        domainId: data.domainId,
			siteLocation: data.siteLocation,
			siteReferrer: data.siteReferrer,
			siteLanguage: data.siteLanguage,
			source: data.source,
			screenWidth: data.screenWidth,
			screenHeight: data.screenHeight,
			screenColorDepth: data.screenColorDepth,
			deviceName: data.deviceName,
			deviceManufacturer: data.deviceManufacturer,
			osName: data.osName,
			osVersion: data.osVersion,
			browserName: data.browserName,
			browserVersion: data.browserVersion,
			browserWidth: data.browserWidth,
			browserHeight: data.browserHeight,
			isNewVisitorSession: isNewVisitorSession,
		}),
	)
}

const update = async (id) => {
	const enhance = (entry) => {
		return entry == null ? entry : response(entry)
	}

	return enhance(
		await Record.findOneAndUpdate({
			id,
		}, {
			$set: {
				updated: Date.now(),
			},
		}, {
			new: true,
		}),
	)
}

const anonymize = (clientId, ignoreId) => {
	// Don't return anything about the update
	return Record.updateMany({
		$and: [
			{ clientId },
			{
				id: {
					$ne: ignoreId,
				},
			},
		],
	}, {
		clientId: null,
		siteLanguage: null,
		screenWidth: null,
		screenHeight: null,
		screenColorDepth: null,
		deviceName: null,
		deviceManufacturer: null,
		osName: null,
		osVersion: null,
		browserName: null,
		browserVersion: null,
		browserWidth: null,
		browserHeight: null,
	})
}

const del = (domainId) => {
	return Record.deleteMany({
		domainId,
	})
}

module.exports = {
	add,
	update,
	anonymize,
	del,
}
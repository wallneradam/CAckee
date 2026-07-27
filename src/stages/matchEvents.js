'use strict'

module.exports = (ids, domainIds) => {
	const stage = {
		$match: {},
	}

	if (ids != null) {
		stage.$match.eventId = {
			$in: ids,
		}
	}

	if (domainIds != null) {
		stage.$match.domainId = {
			$in: domainIds,
		}
	}

	return stage
}
'use strict'

// Counts the unique visitors collected with `$addToSet: '$visitorId'`.
// Actions created before the visitorId was introduced, and actions sent by
// trackers that don't provide one, must not be counted as a visitor. Removing
// null from the set beforehand keeps those out of the size.
module.exports = {
	$size: {
		$setDifference: [ '$visitors', [ null ]],
	},
}
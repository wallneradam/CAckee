const REFETCH_THROTTLE_MS = 2000
let lastRefetch = 0

export default (client, reason) => {
	const now = Date.now()
	if (now - lastRefetch < REFETCH_THROTTLE_MS) {
		console.debug('[Ackee] full refetch skipped (throttled)', { reason })
		return
	}
	lastRefetch = now
	console.debug('[Ackee] full refetch triggered', { reason })
	client.refetchQueries({ include: 'active' })
}

const REFETCH_THROTTLE_MS = 2000
let lastRefetch = 0

export default (client) => {
	const now = Date.now()
	if (now - lastRefetch < REFETCH_THROTTLE_MS) return
	lastRefetch = now
	client.reFetchObservableQueries()
}

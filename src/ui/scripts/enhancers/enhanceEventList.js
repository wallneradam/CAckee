export default (listEntries = []) => {
	return listEntries.map((listEntry) => ({
		text: listEntry.value,
		count: listEntry.count,
		visitors: listEntry.visitors,
		date: listEntry.created == null ? null : new Date(listEntry.created),
	}))
}
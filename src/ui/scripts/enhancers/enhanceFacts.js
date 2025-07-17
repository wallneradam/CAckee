const defaults = {
	activeVisitors: 0,
	averageViews: {
		count: 0,
		change: null,
	},
	averageDuration: {
		count: 0,
		change: null,
	},
	viewsToday: 0,
	viewsMonth: 0,
        viewsYear: 0,
        visitorsToday: 0,
        visitorsWeek: 0,
        visitorsYear: 0,
        returningVisitorsToday: 0,
        returningVisitorsWeek: 0,
        returningVisitorsYear: 0,
        newVisitorsToday: 0,
        newVisitorsWeek: 0,
        newVisitorsYear: 0,
}

export default (facts = {}) => {
	return {
		...defaults,
		...facts,
	}
}
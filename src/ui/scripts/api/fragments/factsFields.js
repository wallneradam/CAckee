import { gql } from '@apollo/client'

export default gql`
	fragment factsFields on Facts {
		id
		activeVisitors
		averageViews {
			count
			change
		}
		averageDuration {
			count
			change
		}
		viewsToday
		viewsMonth
                viewsYear
                visitorsToday
                visitorsWeek
                visitorsMonth
                visitorsYear
                returningVisitorsToday
                returningVisitorsWeek
                returningVisitorsMonth
                returningVisitorsYear
                newVisitorsToday
                newVisitorsWeek
                newVisitorsMonth
                newVisitorsYear
        }
`
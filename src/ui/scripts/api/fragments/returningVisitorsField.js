import { gql } from '@apollo/client'

export default gql`
	fragment returningVisitorsField on DomainStatistics {
		returningVisitors(interval: $interval, limit: $limit) {
			id
			count
		}
	}
`
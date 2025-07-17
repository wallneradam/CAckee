import { gql } from '@apollo/client'

export default gql`
	fragment newVisitorsField on DomainStatistics {
		newVisitors(interval: $interval, limit: $limit) {
			id
			count
		}
	}
`
import { gql } from '@apollo/client'

export default gql`
	fragment visitorsField on DomainStatistics {
		visitors(interval: $interval, limit: $limit) {
			id
			count
		}
	}
`
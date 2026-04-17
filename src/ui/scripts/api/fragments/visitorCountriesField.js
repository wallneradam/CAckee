import { gql } from '@apollo/client'

export default gql`
	fragment visitorCountriesField on DomainStatistics {
		visitorCountries(range: $range, limit: $limit) {
			id
			code
			value
			count
		}
	}
`
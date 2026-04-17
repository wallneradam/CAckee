import { gql } from '@apollo/client'

import useQuery from '../../utils/useQuery'
import enhanceVisitorCountries from '../../../enhancers/enhanceVisitorCountries'

const QUERY = gql`
	query fetchMergedVisitorCountries($limit: Int = 250) {
		statistics {
			id
			last24Hours: visitorCountries(range: LAST_24_HOURS, limit: $limit) {
				id
				code
				value
				count
			}
			last7Days: visitorCountries(range: LAST_7_DAYS, limit: $limit) {
				id
				code
				value
				count
			}
			last30Days: visitorCountries(range: LAST_30_DAYS, limit: $limit) {
				id
				code
				value
				count
			}
		}
	}
`

const enhance = (countries = {}) => {
	return {
		last24Hours: enhanceVisitorCountries(countries.last24Hours),
		last7Days: enhanceVisitorCountries(countries.last7Days),
		last30Days: enhanceVisitorCountries(countries.last30Days),
	}
}

export default (filters = {}) => {
	const selector = (data) => data?.statistics

	return useQuery(QUERY, selector, enhance, {
		variables: filters,
	})
}
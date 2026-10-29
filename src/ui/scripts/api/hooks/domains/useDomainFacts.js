import { gql } from '@apollo/client'

import useQuery from '../../utils/useQuery'
import enhanceFacts from '../../../enhancers/enhanceFacts'

const QUERY = gql`
	query fetchDomainFacts {
		domains {
			id
			title
			facts {
				id
				visitorsToday
				returningVisitorsToday
				newVisitorsToday
			}
		}
	}
`

export default () => {
	const selector = (data) => data?.domains
	const enhancer = (domains = []) => domains.map((domain) => ({
		id: domain.id,
		title: domain.title,
		facts: enhanceFacts(domain.facts),
	}))

	return useQuery(QUERY, selector, enhancer)
}
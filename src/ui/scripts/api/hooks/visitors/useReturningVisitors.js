import { gql } from '@apollo/client'

import useQuery from '../../utils/useQuery'
import returningVisitorsField from '../../fragments/returningVisitorsField'
import enhanceVisitors from '../../../enhancers/enhanceVisitors'

const QUERY = gql`
	query fetchReturningVisitors($id: ID!, $interval: Interval!, $limit: Int) {
		domain(id: $id) {
			id
			statistics {
				id
				...returningVisitorsField
			}
		}
	}

	${returningVisitorsField}
`

export default (id, filters) => {
	const selector = (data) => data?.domain.statistics.returningVisitors
	const enhancer = (value) => enhanceVisitors(value, filters.limit)

	return useQuery(QUERY, selector, enhancer, {
		variables: {
			...filters,
			id,
		},
	})
}
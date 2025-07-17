import { gql } from '@apollo/client'

import useQuery from '../../utils/useQuery'
import newVisitorsField from '../../fragments/newVisitorsField'
import enhanceVisitors from '../../../enhancers/enhanceVisitors'

const QUERY = gql`
	query fetchNewVisitors($id: ID!, $interval: Interval!, $limit: Int) {
		domain(id: $id) {
			id
			statistics {
				id
				...newVisitorsField
			}
		}
	}

	${newVisitorsField}
`

export default (id, filters) => {
	const selector = (data) => data?.domain.statistics.newVisitors
	const enhancer = (value) => enhanceVisitors(value, filters.limit)

	return useQuery(QUERY, selector, enhancer, {
		variables: {
			...filters,
			id,
		},
	})
}
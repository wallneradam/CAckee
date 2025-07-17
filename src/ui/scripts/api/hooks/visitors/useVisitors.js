import { gql } from '@apollo/client'

import useQuery from '../../utils/useQuery'
import visitorsField from '../../fragments/visitorsField'
import enhanceVisitors from '../../../enhancers/enhanceVisitors'

const QUERY = gql`
	query fetchVisitors($id: ID!, $interval: Interval!, $limit: Int) {
		domain(id: $id) {
			id
			statistics {
				id
				...visitorsField
			}
		}
	}

	${visitorsField}
`

export default (id, filters) => {
	const selector = (data) => data?.domain.statistics.visitors
	const enhancer = (value) => enhanceVisitors(value, filters.limit)

	return useQuery(QUERY, selector, enhancer, {
		variables: {
			...filters,
			id,
		},
	})
}
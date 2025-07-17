import { gql } from '@apollo/client'

import useQuery from '../../utils/useQuery'
import returningVisitorsField from '../../fragments/returningVisitorsField'
import enhanceVisitors from '../../../enhancers/enhanceVisitors'

const QUERY = gql`
	query fetchMergedReturningVisitors($interval: Interval!, $limit: Int) {
		statistics {
			id
			...returningVisitorsField
		}
	}

	${returningVisitorsField}
`

export default (filters, options) => {
	const selector = (data) => data?.statistics.returningVisitors
	const enhancer = (value) => enhanceVisitors(value, filters.limit)

	return useQuery(QUERY, selector, enhancer, {
		variables: filters,
		...options,
		fetchPolicy: 'no-cache',
	})
}
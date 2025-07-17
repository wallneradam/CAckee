import { gql } from '@apollo/client'

import useQuery from '../../utils/useQuery'
import visitorsField from '../../fragments/visitorsField'
import enhanceVisitors from '../../../enhancers/enhanceVisitors'

const QUERY = gql`
	query fetchMergedVisitors($interval: Interval!, $limit: Int) {
		statistics {
			id
			...visitorsField
		}
	}

	${visitorsField}
`

export default (filters, options) => {
	const selector = (data) => data?.statistics.visitors
	const enhancer = (value) => enhanceVisitors(value, filters.limit)

	return useQuery(QUERY, selector, enhancer, {
		variables: filters,
		...options,
		fetchPolicy: 'no-cache',
	})
}
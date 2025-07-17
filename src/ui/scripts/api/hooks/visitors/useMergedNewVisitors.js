import { gql } from '@apollo/client'

import useQuery from '../../utils/useQuery'
import newVisitorsField from '../../fragments/newVisitorsField'
import enhanceVisitors from '../../../enhancers/enhanceVisitors'

const QUERY = gql`
	query fetchMergedNewVisitors($interval: Interval!, $limit: Int) {
		statistics {
			id
			...newVisitorsField
		}
	}

	${newVisitorsField}
`

export default (filters, options) => {
	const selector = (data) => data?.statistics.newVisitors
	const enhancer = (value) => enhanceVisitors(value, filters.limit)

	return useQuery(QUERY, selector, enhancer, {
		variables: filters,
		...options,
		fetchPolicy: 'no-cache',
	})
}
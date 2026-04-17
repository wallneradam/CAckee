import { gql } from '@apollo/client'

import useQuery from '../../utils/useQuery'
import useRefetchOnActiveVisitorsChange from '../../utils/useRefetchOnActiveVisitorsChange'
import enhanceFacts from '../../../enhancers/enhanceFacts'

const QUERY = gql`
	query fetchActiveVisitors($id: ID!) {
		domain(id: $id) {
			id
			facts {
				id
				activeVisitors
			}
		}
	}
`

export default (id) => {
	const selector = (data) => data?.domain.facts
	const enhancer = enhanceFacts

	const result = useQuery(QUERY, selector, enhancer, {
		variables: {
			id,
		},
		pollInterval: 5000,
		skipPollAttempt: () => document.hidden,
	})

	useRefetchOnActiveVisitorsChange(result.value)

	return result
}
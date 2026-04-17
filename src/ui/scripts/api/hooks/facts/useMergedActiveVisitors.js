import { gql } from '@apollo/client'

import useQuery from '../../utils/useQuery'
import useRefetchOnActiveVisitorsChange from '../../utils/useRefetchOnActiveVisitorsChange'
import enhanceFacts from '../../../enhancers/enhanceFacts'

const QUERY = gql`
	query fetchMergedActiveVisitors {
		facts {
			id
			activeVisitors
		}
	}
`

export default () => {
	const selector = (data) => data?.facts
	const enhancer = enhanceFacts

	const result = useQuery(QUERY, selector, enhancer, {
		pollInterval: 5000,
		skipPollAttempt: () => document.hidden,
	})

	useRefetchOnActiveVisitorsChange(result.value)

	return result
}
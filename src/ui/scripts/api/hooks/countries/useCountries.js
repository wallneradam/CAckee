import { gql } from '@apollo/client'

import useQuery from '../../utils/useQuery'
import countriesField from '../../fragments/countriesField'
import enhanceCountries from '../../../enhancers/enhanceCountries'

const QUERY = gql`
	query fetchCountries($id: ID!, $sorting: Sorting!, $range: Range) {
		domain(id: $id) {
			id
			statistics {
				id
				...countriesField
			}
		}
	}

	${ countriesField }
`

export default (id, filters) => {
	const selector = (data) => data?.domain.statistics.countries
	const enhancer = enhanceCountries

	return useQuery(QUERY, selector, enhancer, {
		variables: {
			...filters,
			id,
		},
	})
}
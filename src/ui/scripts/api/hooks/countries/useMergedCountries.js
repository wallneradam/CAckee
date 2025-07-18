import { gql } from '@apollo/client'

import useQuery from '../../utils/useQuery'
import countriesField from '../../fragments/countriesField'
import enhanceCountries from '../../../enhancers/enhanceCountries'

const QUERY = gql`
	query fetchMergedCountries($sorting: Sorting!, $range: Range) {
		statistics {
			id
			...countriesField
		}
	}

	${ countriesField }
`

export default (filters) => {
	const selector = (data) => data?.statistics.countries
	const enhancer = enhanceCountries

	return useQuery(QUERY, selector, enhancer, {
		variables: filters,
	})
}
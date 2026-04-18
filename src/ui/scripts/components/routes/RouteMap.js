import { createElement as h } from 'react'
import PropTypes from 'prop-types'

import useMergedVisitorCountries from '../../api/hooks/countries/useMergedVisitorCountries'
import useVisitorCountries from '../../api/hooks/countries/useVisitorCountries'
import useDomains from '../../api/hooks/domains/useDomains'

import CardStatistics from '../cards/CardStatistics'
import RendererWorldMap from '../renderers/RendererWorldMap'

const RouteMap = (props) => {
	const domainId = props.filters.mapDomainId
	const domains = useDomains()
	const selectedDomain = domains.value.find((domain) => domain.id === domainId)
	const hasDomainFilter = selectedDomain != null

	return h(CardStatistics, {
		wide: true,
		headline: 'Map',
		hook: hasDomainFilter === true ? useVisitorCountries : useMergedVisitorCountries,
		hookArgs: hasDomainFilter === true ? [
			selectedDomain.id,
			{
				limit: 250,
			},
		] : [
			{
				limit: 250,
			},
		],
		renderer: RendererWorldMap,
	})
}

RouteMap.propTypes = {
	filters: PropTypes.object.isRequired,
}

export default RouteMap
import { createElement as h } from 'react'

import useMergedVisitorCountries from '../../api/hooks/countries/useMergedVisitorCountries'

import CardStatistics from '../cards/CardStatistics'
import RendererWorldMap from '../renderers/RendererWorldMap'

const RouteMap = () => {
	return h(CardStatistics, {
		wide: true,
		headline: 'Map',
		hook: useMergedVisitorCountries,
		hookArgs: [
			{
				limit: 250,
			},
		],
		renderer: RendererWorldMap,
	})
}

export default RouteMap
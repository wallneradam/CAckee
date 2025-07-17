import { createElement as h, Fragment } from 'react'
import PropTypes from 'prop-types'

import { MODALS_VISITORS } from '../../constants/modals'

import useDomains from '../../api/hooks/domains/useDomains'
import useMergedVisitors from '../../api/hooks/visitors/useMergedVisitors'
import useVisitors from '../../api/hooks/visitors/useVisitors'

import CardStatistics from '../cards/CardStatistics'
import RendererVisitors from '../renderers/RendererVisitors'

const RouteUniqueVisitors = (props) => {
	const domains = useDomains()

	return (
		h(Fragment, {},
			h(CardStatistics, {
				wide: true,
				headline: 'Unique Visitors',
				hook: useMergedVisitors,
				hookArgs: [
					{
						interval: props.filters.interval,
						limit: 14,
					},
				],
				renderer: RendererVisitors,
				rendererProps: {
					interval: props.filters.interval,
					onItemClick: (index) => props.addModal(MODALS_VISITORS, {
						index,
						interval: props.filters.interval,
						limit: 14,
					}),
				},
			}),
			domains.value.map((domain) => {
				return h(CardStatistics, {
					key: domain.id,
					headline: domain.title,
					onMore: () => props.setRoute(`/domains/${ domain.id }`),
					hook: useVisitors,
					hookArgs: [
						domain.id,
						{
							interval: props.filters.interval,
							limit: 7,
						},
					],
					renderer: RendererVisitors,
					rendererProps: {
						interval: props.filters.interval,
					},
				})
			}),
		)
	)
}

RouteUniqueVisitors.propTypes = {
	setRoute: PropTypes.func.isRequired,
	filters: PropTypes.object.isRequired,
	addModal: PropTypes.func.isRequired,
}

export default RouteUniqueVisitors
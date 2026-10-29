import { createElement as h } from 'react'
import PropTypes from 'prop-types'

import formatNumber from '../../utils/formatNumber'
import pluralize from '../../utils/pluralize'

import Headline from '../Headline'
import PresentationValueUnit from '../presentations/PresentationValueUnit'

const Presentation = (props) => {
	return (
		h('div', { className: 'facts__card' },
			h(Headline, {
				type: 'h3',
				size: 'small',
				className: 'facts__top',
			}, props.headline),
			h('div', { className: 'facts__left' },
				h(PresentationValueUnit, {
					value: formatNumber(props.value),
					unit: pluralize([ 'visitors', 'visitor', 'visitors' ], props.value),
				}),
			),
		)
	)
}

const Row = (props) => {
	const { visitorsToday, returningVisitorsToday, newVisitorsToday } = props.facts

	return (
		h('div', { className: 'domainFacts__domain' },
			h(Headline, {
				type: 'h3',
				size: 'medium',
				className: 'domainFacts__title',
				onClick: props.onClick,
			}, props.title),
			h('div', { className: 'facts' },
				h(Presentation, { headline: 'Visitors today', value: visitorsToday }),
				h(Presentation, { headline: 'Returning visitors today', value: returningVisitorsToday }),
				h(Presentation, { headline: 'New visitors today', value: newVisitorsToday }),
			),
		)
	)
}

const CardDomainFacts = (props) => {
	const { value } = props.hook(...props.hookArgs)

	if (value.length === 0) return null

	return (
		h('div', { className: 'domainFacts' },
			h(Headline, {
				type: 'h2',
				size: 'medium',
				className: 'domainFacts__headline',
			}, 'Domains'),
			value.map((domain) => h(Row, {
				key: domain.id,
				title: domain.title,
				facts: domain.facts,
				onClick: () => props.onDomainClick(domain),
			})),
		)
	)
}

CardDomainFacts.propTypes = {
	hook: PropTypes.func.isRequired,
	hookArgs: PropTypes.array.isRequired,
	onDomainClick: PropTypes.func.isRequired,
}

export default CardDomainFacts
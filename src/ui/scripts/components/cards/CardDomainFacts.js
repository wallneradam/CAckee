import { createElement as h, Fragment } from 'react'
import PropTypes from 'prop-types'

import formatNumber from '../../utils/formatNumber'
import pluralize from '../../utils/pluralize'

import Headline from '../Headline'
import PresentationValueUnit from '../presentations/PresentationValueUnit'

const Presentation = (props) => {
	return (
		h('div', { className: 'facts__card' },
			h(Headline, {
				type: 'h2',
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

const CardDomainFacts = (props) => {
	const { value } = props.hook(...props.hookArgs)

	if (value.length === 0) return null

	return (
		h('div', { className: 'facts' },
			value.map((domain) => h(Fragment, { key: domain.id },
				h('button', {
					className: 'domainFacts__divider',
					title: `Open ${ domain.title }`,
					onClick: () => props.onDomainClick(domain),
				}, domain.title),
				h(Presentation, {
					headline: 'Visitors today',
					value: domain.facts.visitorsToday,
				}),
				h(Presentation, {
					headline: 'Returning visitors today',
					value: domain.facts.returningVisitorsToday,
				}),
				h(Presentation, {
					headline: 'New visitors today',
					value: domain.facts.newVisitorsToday,
				}),
			)),
		)
	)
}

CardDomainFacts.propTypes = {
	hook: PropTypes.func.isRequired,
	hookArgs: PropTypes.array.isRequired,
	onDomainClick: PropTypes.func.isRequired,
}

export default CardDomainFacts
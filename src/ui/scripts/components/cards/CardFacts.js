import { createElement as h, useState } from 'react'
import PropTypes from 'prop-types'

import formatDuration from '../../utils/formatDuration'
import formatNumber from '../../utils/formatNumber'
import pluralize from '../../utils/pluralize'

import Headline from '../Headline'
import Select from '../Select'
import TextBadge from '../TextBadge'
import ChangeBadge from '../ChangeBadge'
import PresentationValueUnit from '../presentations/PresentationValueUnit'

const averageVisitorOptions = [
	{
		value: 'averageVisitors',
		label: 'Average visitors',
		title: (count) => `An average of ${ count } visitors per day during the last 14 days`,
	},
	{
		value: 'averageReturningVisitors',
		label: 'Average returning visitors',
		title: (count) => `An average of ${ count } returning visitors per day during the last 14 days`,
	},
	{
		value: 'averageNewVisitors',
		label: 'Average new visitors',
		title: (count) => `An average of ${ count } new visitors per day during the last 14 days`,
	},
]

const Presentation = (props) => {
	return (
		h('div', { className: 'facts__card' },
			h(Headline, {
				type: 'h2',
				size: 'small',
				className: 'facts__top',
			}, props.headline),
			h('div', {
				className: 'facts__left',
				title: props.title,
			},
				h(PresentationValueUnit, {
					value: props.value,
					unit: props.unit,
				}),
			),
			props.addition != null && h('div', {
				className: 'facts__right',
			}, props.addition),
		)
	)
}

const CardFacts = (props) => {
	const [ averageVisitorType, setAverageVisitorType ] = useState('averageVisitors')
	const { value } = props.hook(...props.hookArgs)

	const {
		activeVisitors,
		averageVisitors,
		averageDuration,
		viewsToday,
		viewsMonth,
		visitorsToday,
		visitorsMonth,
		visitorsYear,
		viewsYear,
		returningVisitorsToday,
		returningVisitorsMonth,
		returningVisitorsYear,
		newVisitorsToday,
		newVisitorsMonth,
		newVisitorsYear,
	} = value

	const averageVisitorOption = averageVisitorOptions.find((option) => option.value === averageVisitorType)
	const averageVisitor = value[averageVisitorType] || averageVisitors

	return (
		h('div', {
			className: 'facts',
		},
			h(Presentation, {
				headline: 'Active visitors',
				value: activeVisitors,
				unit: pluralize([ 'visitors', 'visitor', 'visitors' ], activeVisitors),
				addition: h(TextBadge, { type: 'positive', value: 'Live' }),
			}),
			h(Presentation, {
				headline: h(Select, {
					id: 'average-visitors',
					value: averageVisitorType,
					items: averageVisitorOptions.map((option) => ({
						value: option.value,
						label: option.label,
					})),
					onChange: (event) => setAverageVisitorType(event.target.value),
				}),
				value: formatNumber(averageVisitor.count),
				unit: 'per day',
				title: averageVisitorOption.title(averageVisitor.count),
				addition: averageVisitor.change != null && h(ChangeBadge, { value: averageVisitor.change }),
			}),
			h(Presentation, {
				headline: 'Average duration',
				value: formatDuration(averageDuration.count).value,
				unit: formatDuration(averageDuration.count).unit,
				title: `An average visit duration of ${ formatDuration(averageDuration.count).value }${ formatDuration(averageDuration.count).unit } per day during the last 14 days`,
				addition: averageDuration.change != null && h(ChangeBadge, { value: averageDuration.change }),
			}),
			h(Presentation, {
				headline: 'Visitors today',
				value: formatNumber(visitorsToday),
				unit: pluralize([ 'visitors', 'visitor', 'visitors' ], visitorsToday),
			}),
			h(Presentation, {
				headline: 'Visitors this month',
				value: formatNumber(visitorsMonth),
				unit: pluralize([ 'visitors', 'visitor', 'visitors' ], visitorsMonth),
			}),
			h(Presentation, {
				headline: 'Visitors this year',
				value: formatNumber(visitorsYear),
				unit: pluralize([ 'visitors', 'visitor', 'visitors' ], visitorsYear),
			}),
			h(Presentation, {
				headline: 'Returning visitors today',
				value: formatNumber(returningVisitorsToday),
				unit: pluralize([ 'visitors', 'visitor', 'visitors' ], returningVisitorsToday),
			}),
			h(Presentation, {
				headline: 'Returning visitors this month',
				value: formatNumber(returningVisitorsMonth),
				unit: pluralize([ 'visitors', 'visitor', 'visitors' ], returningVisitorsMonth),
			}),
			h(Presentation, {
				headline: 'Returning visitors this year',
				value: formatNumber(returningVisitorsYear),
				unit: pluralize([ 'visitors', 'visitor', 'visitors' ], returningVisitorsYear),
			}),
			h(Presentation, {
				headline: 'New visitors today',
				value: formatNumber(newVisitorsToday),
				unit: pluralize([ 'visitors', 'visitor', 'visitors' ], newVisitorsToday),
			}),
			h(Presentation, {
				headline: 'New visitors this month',
				value: formatNumber(newVisitorsMonth),
				unit: pluralize([ 'visitors', 'visitor', 'visitors' ], newVisitorsMonth),
			}),
			h(Presentation, {
				headline: 'New visitors this year',
				value: formatNumber(newVisitorsYear),
				unit: pluralize([ 'visitors', 'visitor', 'visitors' ], newVisitorsYear),
			}),
			h(Presentation, {
				headline: 'Views today',
				value: formatNumber(viewsToday),
				unit: pluralize([ 'views', 'view', 'views' ], viewsToday),
			}),
			h(Presentation, {
				headline: 'Views this month',
				value: formatNumber(viewsMonth),
				unit: pluralize([ 'views', 'view', 'views' ], viewsMonth),
			}),
			h(Presentation, {
				headline: 'Views this year',
				value: formatNumber(viewsYear),
				unit: pluralize([ 'views', 'view', 'views' ], viewsYear),
			}),
		)
	)
}

CardFacts.propTypes = {
	hook: PropTypes.func.isRequired,
	hookArgs: PropTypes.array.isRequired,
}

export default CardFacts
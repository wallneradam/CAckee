import { createElement as h, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import formatCount from '../../utils/formatCount'
import worldMap from '../../constants/worldMap'

const ranges = [
	{
		key: 'last24Hours',
		label: '24 hours',
	},
	{
		key: 'last7Days',
		label: '7 days',
	},
	{
		key: 'last30Days',
		label: '30 days',
	},
]

const countryCode = (code) => code.toUpperCase()

const percent = (count, total) => {
	if (total === 0) return '0%'

	return `${ ((count / total) * 100).toFixed(1) }%`
}

const intensity = (count, max) => {
	if (count === 0 || max === 0) return 0

	return Math.max(0.22, count / max)
}

const RendererWorldMap = (props) => {
	const [ activeRange, setActiveRange ] = useState(ranges[0].key)
	const [ activeCountry, setActiveCountry ] = useState()

	const activeItems = props.items[activeRange] || []
	const activeRangeLabel = ranges.find((range) => range.key === activeRange).label

	const countries = useMemo(() => {
		return activeItems.reduce((result, item) => {
			result[item.code] = item
			return result
		}, {})
	}, [ activeItems ])

	const total = useMemo(() => activeItems.reduce((result, item) => result + item.count, 0), [ activeItems ])
	const max = useMemo(() => activeItems.reduce((result, item) => Math.max(result, item.count), 0), [ activeItems ])
	const topItems = activeItems.slice(0, 8)
	const selectedItem = activeCountry == null ? topItems[0] : countries[activeCountry]

	useEffect(() => {
		props.setStatusLabel(activeRangeLabel)
	}, [ activeRangeLabel ])

	return (
		h('div', { className: 'worldMap' },
			h('div', { className: 'worldMap__controls' },
				ranges.map((range) => (
					h('button', {
						key: range.key,
						className: classNames({
							'worldMap__control': true,
							'worldMap__control--active': activeRange === range.key,
							'link': true,
						}),
						onClick: () => setActiveRange(range.key),
					}, range.label)
				)),
			),
			total === 0 ? (
				h('div', { className: 'worldMap__empty color-light' }, 'No visitor country data yet.')
			) : (
				h('div', { className: 'worldMap__body' },
					h('svg', {
						'className': 'worldMap__svg',
						'viewBox': worldMap.viewBox,
						'role': 'img',
						'aria-label': `Unique visitors by country for the last ${ activeRangeLabel }`,
					},
						worldMap.locations.map((location) => {
							const code = countryCode(location.id)
							const item = countries[code]
							const count = item == null ? 0 : item.count

							return h('path', {
								'key': location.id,
								'className': classNames({
									'worldMap__country': true,
									'worldMap__country--active': activeCountry === code,
									'worldMap__country--filled': count > 0,
								}),
								'd': location.path,
								'style': {
									'--intensity': intensity(count, max),
								},
								'tabIndex': count > 0 ? 0 : undefined,
								'role': count > 0 ? 'img' : undefined,
								'aria-label': count > 0 ? `${ item.text }: ${ formatCount(count) } unique visitors` : undefined,
								'onMouseEnter': count > 0 ? () => setActiveCountry(code) : undefined,
								'onMouseLeave': count > 0 ? () => setActiveCountry() : undefined,
								'onFocus': count > 0 ? () => setActiveCountry(code) : undefined,
								'onBlur': count > 0 ? () => setActiveCountry() : undefined,
							}, count > 0 ? h('title', {}, `${ item.text }: ${ formatCount(count) } unique visitors`) : null)
						}),
					),
					h('div', { className: 'worldMap__aside' },
						selectedItem != null && h('div', { className: 'worldMap__summary' },
							h('span', { className: 'worldMap__label color-light' }, activeRangeLabel),
							h('strong', { className: 'worldMap__headline color-white' }, selectedItem.text),
							h('span', { className: 'worldMap__meta color-primary' },
								`${ formatCount(selectedItem.count) } unique visitors`,
							),
							h('span', { className: 'worldMap__share color-light' },
								`${ percent(selectedItem.count, total) } of mapped visitors`,
							),
						),
						h('div', { className: 'worldMap__list' },
							topItems.map((item) => (
								h('button', {
									key: item.code,
									className: classNames({
										'worldMap__row': true,
										'worldMap__row--active': activeCountry === item.code,
										'link': true,
									}),
									onMouseEnter: () => setActiveCountry(item.code),
									onMouseLeave: () => setActiveCountry(),
									onFocus: () => setActiveCountry(item.code),
									onBlur: () => setActiveCountry(),
								},
									h('span', { className: 'worldMap__rowText' }, item.text),
									h('span', { className: 'worldMap__rowCount color-primary' }, formatCount(item.count)),
								)
							)),
						),
					),
				)
			),
		)
	)
}

RendererWorldMap.propTypes = {
	items: PropTypes.shape({
		last24Hours: PropTypes.array.isRequired,
		last7Days: PropTypes.array.isRequired,
		last30Days: PropTypes.array.isRequired,
	}).isRequired,
	setStatusLabel: PropTypes.func.isRequired,
}

export default RendererWorldMap
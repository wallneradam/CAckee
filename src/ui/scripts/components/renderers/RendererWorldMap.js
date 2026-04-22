import { createElement as h, useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import formatCount from '../../utils/formatCount'
import worldMap from '../../constants/worldMap'

const ranges = [
	{
		key: 'last24Hours',
		label: '24 hours',
		shortLabel: '24h',
	},
	{
		key: 'last7Days',
		label: '7 days',
		shortLabel: '7D',
	},
	{
		key: 'last30Days',
		label: '30 days',
		shortLabel: '30D',
	},
]

const [ baseX, baseY, baseWidth, baseHeight ] = worldMap.viewBox.split(' ').map(Number)
const baseViewBox = {
	x: baseX,
	y: baseY,
	width: baseWidth,
	height: baseHeight,
}
const minZoom = 1
const maxZoom = 5

const countryCode = (code) => code.toUpperCase()

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

const clampViewBox = (viewBox) => {
	return {
		x: clamp(viewBox.x, baseViewBox.x, baseViewBox.x + baseViewBox.width - viewBox.width),
		y: clamp(viewBox.y, baseViewBox.y, baseViewBox.y + baseViewBox.height - viewBox.height),
		width: viewBox.width,
		height: viewBox.height,
	}
}

const viewBoxToString = (viewBox) => `${ viewBox.x } ${ viewBox.y } ${ viewBox.width } ${ viewBox.height }`

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
	const [ viewBox, setViewBox ] = useState(baseViewBox)
	const [ dragging, setDragging ] = useState(false)
	const [ canHover ] = useState(() => (
		typeof window !== 'undefined'
			&& window.matchMedia('(hover: hover) and (pointer: fine)').matches === true
	))
	const svgRef = useRef()
	const drag = useRef()
	const dragMoved = useRef(false)

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
	const hoveredItem = activeCountry == null ? null : countries[activeCountry]
	const zoom = baseViewBox.width / viewBox.width
	const zoomed = zoom > minZoom

	useEffect(() => {
		props.setStatusLabel(activeRangeLabel)
	}, [ activeRangeLabel ])

	const resetViewBox = () => setViewBox(baseViewBox)

	const pointFromEvent = (event, element) => {
		const rect = element.getBoundingClientRect()
		const xRatio = (event.clientX - rect.left) / rect.width
		const yRatio = (event.clientY - rect.top) / rect.height

		return {
			rect,
			xRatio,
			yRatio,
			x: viewBox.x + xRatio * viewBox.width,
			y: viewBox.y + yRatio * viewBox.height,
		}
	}

	useEffect(() => {
		const element = svgRef.current
		if (element == null) return

		const onWheel = (event) => {
			event.preventDefault()
			event.stopPropagation()
			event.stopImmediatePropagation()

			const point = pointFromEvent(event, element)
			const nextZoom = clamp(zoom * (event.deltaY < 0 ? 1.18 : 0.85), minZoom, maxZoom)
			const nextWidth = baseViewBox.width / nextZoom
			const nextHeight = baseViewBox.height / nextZoom

			setViewBox(clampViewBox({
				x: point.x - point.xRatio * nextWidth,
				y: point.y - point.yRatio * nextHeight,
				width: nextWidth,
				height: nextHeight,
			}))
		}

		element.addEventListener('wheel', onWheel, {
			capture: true,
			passive: false,
		})

		return () => {
			element.removeEventListener('wheel', onWheel, {
				capture: true,
			})
		}
	}, [ total, viewBox, zoom ])

	const onPointerDown = (event) => {
		if (event.button !== 0) return

		event.preventDefault()

		setDragging(true)
		dragMoved.current = false
		drag.current = {
			clientX: event.clientX,
			clientY: event.clientY,
			viewBox,
		}
		event.currentTarget.setPointerCapture(event.pointerId)
	}

	const onPointerMove = (event) => {
		if (drag.current == null) return

		const rect = event.currentTarget.getBoundingClientRect()
		const pixelDelta = Math.hypot(event.clientX - drag.current.clientX, event.clientY - drag.current.clientY)
		if (pixelDelta > 4) dragMoved.current = true

		const deltaX = ((event.clientX - drag.current.clientX) / rect.width) * drag.current.viewBox.width
		const deltaY = ((event.clientY - drag.current.clientY) / rect.height) * drag.current.viewBox.height

		setViewBox(clampViewBox({
			...drag.current.viewBox,
			x: drag.current.viewBox.x - deltaX,
			y: drag.current.viewBox.y - deltaY,
		}))
	}

	const onPointerUp = (event) => {
		setDragging(false)
		drag.current = undefined
		if (event.currentTarget.hasPointerCapture(event.pointerId)) {
			event.currentTarget.releasePointerCapture(event.pointerId)
		}
	}

	const zoomToElement = (element) => {
		if (element == null || typeof element.getBBox !== 'function') return

		const bbox = element.getBBox()
		if (bbox.width === 0 || bbox.height === 0) return

		const aspect = baseViewBox.width / baseViewBox.height
		const padFactor = 1.8
		const targetWidth = Math.max(bbox.width * padFactor, bbox.height * padFactor * aspect)
		const targetHeight = targetWidth / aspect
		const minWidth = baseViewBox.width / maxZoom
		const clampedWidth = clamp(targetWidth, minWidth, baseViewBox.width)
		const clampedHeight = clampedWidth / aspect
		const cx = bbox.x + bbox.width / 2
		const cy = bbox.y + bbox.height / 2

		setViewBox(clampViewBox({
			x: cx - clampedWidth / 2,
			y: cy - clampedHeight / 2,
			width: clampedWidth,
			height: Math.min(clampedHeight, baseViewBox.height),
		}))
	}

	const onCountryClick = (event) => {
		if (dragMoved.current === true) return
		if (canHover === false) return

		zoomToElement(event.currentTarget)
	}

	const onRowClick = (code) => {
		if (canHover === false) return
		if (svgRef.current == null) return

		const element = svgRef.current.querySelector(`[data-code="${ code }"]`)
		zoomToElement(element)
	}

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
					},
						h('span', { className: 'worldMap__controlLabel worldMap__controlLabel--full' }, range.label),
						h('span', { className: 'worldMap__controlLabel worldMap__controlLabel--short' }, range.shortLabel),
					)
				)),
				zoomed === true && h('button', {
					className: 'worldMap__control link',
					onClick: resetViewBox,
				}, 'Reset map'),
			),
			total === 0 ? (
				h('div', { className: 'worldMap__empty color-light' }, 'No visitor country data yet.')
			) : (
				h('div', { className: 'worldMap__body' },
					h('svg', {
						'ref': svgRef,
						'className': classNames({
							'worldMap__svg': true,
							'worldMap__svg--dragging': dragging === true,
						}),
						'viewBox': viewBoxToString(viewBox),
						'role': 'img',
						'aria-label': `Unique visitors by country for the last ${ activeRangeLabel }`,
						'onPointerDown': onPointerDown,
						'onPointerMove': onPointerMove,
						'onPointerUp': onPointerUp,
						'onPointerCancel': onPointerUp,
						'onDoubleClick': resetViewBox,
					},
						worldMap.locations.map((location) => {
							const code = countryCode(location.id)
							const item = countries[code]
							const count = item == null ? 0 : item.count

							return h('path', {
								'key': location.id,
								'data-code': code,
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
								'onMouseEnter': count > 0 && canHover === true ? () => setActiveCountry(code) : undefined,
								'onMouseLeave': count > 0 && canHover === true ? () => setActiveCountry() : undefined,
								'onFocus': count > 0 ? () => setActiveCountry(code) : undefined,
								'onBlur': count > 0 ? () => setActiveCountry() : undefined,
								'onClick': count > 0 ? onCountryClick : undefined,
							}, count > 0 ? h('title', {}, `${ item.text }: ${ formatCount(count) } unique visitors`) : null)
						}),
					),
					h('div', { className: 'worldMap__aside' },
						h('div', {
							'className': classNames({
								'worldMap__summary': true,
								'worldMap__summary--placeholder': hoveredItem == null,
							}),
							'aria-hidden': hoveredItem == null ? 'true' : undefined,
						},
							h('strong', { className: 'worldMap__headline color-white' },
								hoveredItem != null ? hoveredItem.text : ' ',
							),
							h('span', { className: 'worldMap__meta color-primary' },
								hoveredItem != null ? `${ formatCount(hoveredItem.count) } unique visitors` : ' ',
							),
							h('span', { className: 'worldMap__share color-light' },
								hoveredItem != null ? `${ percent(hoveredItem.count, total) } of mapped visitors` : ' ',
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
									onMouseEnter: canHover === true ? () => setActiveCountry(item.code) : undefined,
									onMouseLeave: canHover === true ? () => setActiveCountry() : undefined,
									onFocus: () => setActiveCountry(item.code),
									onBlur: () => setActiveCountry(),
									onClick: () => onRowClick(item.code),
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
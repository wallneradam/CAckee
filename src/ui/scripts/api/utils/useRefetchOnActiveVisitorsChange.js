import { useEffect, useRef } from 'react'
import { useApolloClient } from '@apollo/client/react'

import triggerFullRefetch from './triggerFullRefetch'

export default (value) => {
	const client = useApolloClient()
	const previous = useRef()

	const current = value?.activeVisitors

	useEffect(() => {
		if (current == null) return
		if (previous.current != null && previous.current !== current) {
			triggerFullRefetch(client, `activeVisitors ${ previous.current } -> ${ current }`)
		}
		previous.current = current
	}, [ current, client ])
}

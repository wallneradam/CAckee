import { useEffect } from 'react'

export default () => {
	useEffect(() => {
		// Use custom scrollbars on all platforms for consistent design
		document.body.classList.add('customScrollbar')
		return () => document.body.classList.remove('customScrollbar')
	}, [])
}
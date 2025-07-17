import createArray from '../../../utils/createArray'

export default (visitors = [], length) => createArray(length).map((_, index) => {
	const visitor = visitors[index]

	return visitor == null ? 0 : visitor.count
})
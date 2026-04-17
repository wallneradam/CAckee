export default (countries = []) => {
	return countries.map((country) => ({
		code: country.code,
		text: country.value,
		count: country.count,
	}))
}
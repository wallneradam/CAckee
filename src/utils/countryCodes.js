'use strict'

const lookup = require('country-code-lookup')

// Create a country codes object with all ISO 3166-1 alpha-2 codes
const countryCodes = {}

// Get all countries from the lookup library
const allCountries = lookup.countries

// Build the mapping from ISO2 code to country name
allCountries.forEach(country => {
	if (country.iso2) {
		countryCodes[country.iso2] = country.country
	}
})

module.exports = countryCodes
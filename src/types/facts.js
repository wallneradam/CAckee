'use strict'

const { gql } = require('apollo-server-micro')

module.exports = gql`
	type AverageViews {
		"""
		Average number of views per day during the last 14 days, excluding the current day.
		"""
		count: UnsignedInt!
		"""
		Percentage change of the average views when comparing the last 7 days with the previous 7 days.
		Might be undefined when there's not enough data to compare.
		"""
		change: Float
	}

	type AverageDuration {
		"""
		Average visit duration in milliseconds for the last 14 days, excluding the current day.
		"""
		count: UnsignedInt!
		"""
		Percentage change of the average visit duration when comparing the last 7 days with the previous 7 days.
		Might be undefined when there's not enough data to compare.
		"""
		change: Float
	}

	"""
	Facts about a domain. Usually simple data that can be represented in one value.
	"""
	type Facts {
		"""
		Facts identifier.
		"""
		id: ID!
		"""
		Number of visitors currently on your site.
		"""
		activeVisitors: UnsignedInt!
		"""
		Details about the average number of views.
		"""
		averageViews: AverageViews!
		"""
		Details about the average visit duration.
		"""
		averageDuration: AverageDuration!
		"""
		Number of unique views today.
		"""
		viewsToday: UnsignedInt!
		"""
		Number of unique views this month.
		"""
		viewsMonth: UnsignedInt!
                """
                Number of unique views this year.
                """
                viewsYear: UnsignedInt!
                """
                Number of unique visitors today.
                """
                visitorsToday: UnsignedInt!
                """
                Number of unique visitors this week.
                """
                visitorsWeek: UnsignedInt!
                """
                Number of unique visitors this month.
                """
                visitorsMonth: UnsignedInt!
                """
                Number of unique visitors this year.
                """
                visitorsYear: UnsignedInt!
                """
                Number of returning visitors today.
                """
                returningVisitorsToday: UnsignedInt!
                """
                Number of returning visitors this week.
                """
                returningVisitorsWeek: UnsignedInt!
                """
                Number of returning visitors this month.
                """
                returningVisitorsMonth: UnsignedInt!
                """
                Number of returning visitors this year.
                """
                returningVisitorsYear: UnsignedInt!
                """
                Number of new visitors today.
                """
                newVisitorsToday: UnsignedInt!
                """
                Number of new visitors this week.
                """
                newVisitorsWeek: UnsignedInt!
                """
                Number of new visitors this month.
                """
                newVisitorsMonth: UnsignedInt!
                """
                Number of new visitors this year.
                """
                newVisitorsYear: UnsignedInt!
        }

	type Query {
		"""
		Facts of all domains combined. Usually simple data that can be represented in one value.
		"""
		facts: Facts!
	}
`
<div align="center">

<img src="https://s.electerious.com/images/ackee/icon.png" title="Ackee" alt="Ackee logo" width="128">

# Ackee

![Build](https://github.com/electerious/Ackee/workflows/Build/badge.svg) [![Coverage Status](https://coveralls.io/repos/github/electerious/Ackee/badge.svg?branch=master)](https://coveralls.io/github/electerious/Ackee?branch=master) [![Mentioned in Awesome Selfhosted](https://awesome.re/mentioned-badge.svg)](https://github.com/awesome-selfhosted/awesome-selfhosted) [![Donate via PayPal](https://img.shields.io/badge/paypal-donate-009cde.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=CYKBESW577YWE)

Self-hosted, Node.js based analytics tool for those who care about privacy. Ackee runs on your own server, analyzes the traffic of your websites and provides useful statistics in a minimal interface.

[🌍 Website](https://ackee.electerious.com) | [🔮 Live Demo](https://demo.ackee.electerious.com) | [🧸 GraphQL Playground](https://demo.ackee.electerious.com/api)

<br/>

![Ackee in a browser](https://s.electerious.com/images/ackee/readme.png)

</div>

## 🔄 Fork Features

This is a modified Ackee fork that takes an honest approach to visitor tracking:

### New features compared to original Ackee:
- **Returning visitors tracking**: New and returning visitor analytics with a per-site `vid` identifier
- **Visitor analytics charts**: Comprehensive visitor statistics with line charts
- **Country-based analytics**: Visitor statistics by country with IP geolocation
- **World map view**: Interactive map tab showing unique visitor distribution across countries for the last 24 hours, 7 days and 30 days
- **Enhanced dashboard**: Extended dashboard with new metrics and visualizations
- **Domain-aware events with unique visitors**: Actions carry the `vid` and the `domainId`, so every event key shows how many unique visitors triggered it (on row hover) and the events view can be filtered by domain
- **30-minute visitor classification**: Visitors are classified as "new" for 30 minutes after first visit, then "returning"
- **Live dashboard refresh**: The whole dashboard refreshes automatically in the background (via AJAX, no page reload) when you switch back to the tab or when the active visitors count changes. Polling is paused while the tab is hidden to save bandwidth
- **Improved OS detection**: Original Ackee relied on `platform.js`, which can't tell Windows 10 from Windows 11 (frozen UA), labels modern macOS as `OS X 10.15.7`, and fragments Linux into Linux/Ubuntu/Fedora/etc. buckets. This fork:
  - **Windows 11 detection** via UA-CH `platformVersion` (Chromium) or "Segoe UI Variable" font probe (fallback)
  - **macOS** properly labeled as `macOS` instead of `OS X`; Big Sur+ users (where Apple froze the UA at `10_15_7`) shown as `macOS 10.15.7+` since the exact version is no longer detectable
  - **Linux family** (Linux, Ubuntu, Fedora, Linux aarch64/i686/armv7l) aggregated into a single `Linux` bucket on the dashboard, while raw distro names are preserved in the database for any future analysis
  - **Missing OS version** displayed as `-` instead of being silently dropped from the Systems card

### Honest privacy approach:
- **Uses localStorage for visitor tracking**: The tracker stores a per-site `vid` in the visited site's own `localStorage`
- **No cross-domain visitor linking**: The same browser gets separate `vid` values on different websites
- **No visitor tracking cookie**: The visitor identifier is not stored in an Ackee-domain cookie
- **Own-visit cookie remains**: Ackee may still set the `ackee_ignore` cookie when you log in, so your own visits can be ignored
- **Anonymous data**: IP addresses are not stored, only used for country detection
- **No external data sharing**: No data sent to third parties (Google, Facebook, etc.)
- **Self-hosted**: All data stays on your own server
- **Open-source**: Fully transparent and auditable code

> ⚠️ **Important**: This is NOT the original privacy-first Ackee. This fork intentionally tracks returning visitors using a first-party `localStorage` identifier. If you want the original cookie-free analytics behavior, use the [original Ackee](https://github.com/electerious/Ackee).

## 👋 Introduction

> ⚠️ **IMPORTANT**: This is a modified fork of Ackee that tracks unique and returning visitors with a per-site `vid` stored in the visited site's own `localStorage`. This version is NOT privacy-first and does NOT follow the original Ackee's privacy principles. If you're looking for the original privacy-focused Ackee analytics tool, please visit the [official Ackee repository](https://github.com/electerious/Ackee).

Ackee is a self-hosted analytics tool that cares about privacy. We believe that you don't need to track every aspect of your visitors. Ackee keeps tracked data anonymized to avoid that users are identifiable, while still providing helpful insights. It's the right tool for everyone who doesn't need a full-featured marketing analytics platform like Google Analytics or Matomo.

- **Self-hosted**: Ackee runs on your own server and is 100% open-source
- **Modern technologies**: Lightweight Node.js and MongoDB architecture
- **Beautiful**: Minimal and focused interface
- **Returning visitor analytics**: Tracks unique and returning visitors using a per-site `vid` stored in first-party `localStorage`
- **Events**: Track button clicks, newsletter subscriptions and more
- **GraphQL API**: Fully documented GraphQL API that allows you to build new tools upon Ackee

## 🚀 Get started

Get Ackee up and running…

- […with Docker Compose](docs/Get%20started.md#with-docker-compose)
- […with Docker](docs/Get%20started.md#with-docker)
- […with Helm](docs/Get%20started.md#with-helm)
- […without Docker](docs/Get%20started.md#without-docker)
- […with Netlify](docs/Get%20started.md#with-netlify)
- […with Vercel](docs/Get%20started.md#with-vercel)
- […with Heroku](docs/Get%20started.md#with-heroku)
- […with Qovery](docs/Get%20started.md#with-qovery)
- […with Render](docs/Get%20started.md#with-render)
- […with Railway](docs/Get%20started.md#with-railway)
- […with Koyeb](docs/Get%20started.md#with-koyeb)

And configure Ackee and your server correctly…

- […with environment variables](docs/Options.md)
- […with SSL and HTTPS enabled](docs/SSL%20and%20HTTPS.md)
- […with CORS headers](docs/CORS%20headers.md)

Take a look at the [FAQ](docs/FAQ.md) if you have any questions left.

## 📚 Documentation

Documentation and guides are located in [the /docs folder](docs/). Also take a look at the [FAQ](docs/FAQ.md) if you have any questions left.

### API

Ackee features a [GraphQL API](docs/API.md) that allows you to build custom tools upon Ackee. Everything you see in the UI is made from data delivered by the API.

### Options

Ackee uses environment variables and supports [`.env` files](https://www.npmjs.com/package/dotenv) in the root of the project if you want to store all variables in one file. [Options &#187;](docs/Options.md)

This fork also supports optional dashboard branding through environment variables:

| Variable           | Description                                                                                         |
| ------------------ | --------------------------------------------------------------------------------------------------- |
| `ACKEE_BRAND_LOGO` | URL of a custom logo shown in the dashboard header. Leave empty to use Ackee's default circle.      |
| `ACKEE_BRAND_NAME` | Accessible label for the custom logo, for example the organization name.                            |

## Miscellaneous

### Donate

I am working hard on continuously developing and maintaining Ackee. Please consider making a donation to keep the project going strong and me motivated.

- [Become a GitHub sponsor](https://github.com/sponsors/electerious)
- [Donate via PayPal](https://paypal.me/electerious)
- [Buy me a coffee](https://www.buymeacoffee.com/electerious)

### Articles

- [Quit Google Analytics, Self-hosted Gatsby Statistics with Ackee](https://dev.to/aleccool213/quit-google-analytics-self-hosted-gatsby-statistics-with-ackee-4011)
- [Getting Ackee up and running with Heroku 🇪🇸](https://rubenr.dev/blog/ackee-analitica-web-sencilla/)
- [Why I Self-Host My Website Analytics](https://mbuffett.com/posts/why-i-self-host-my-analytics/)

### Related

- [ackee-tracker](https://github.com/electerious/ackee-tracker) - Transfer data to Ackee
- [ackee-bitbar](https://github.com/electerious/ackee-bitbar) - Ackee stats in your macOS menu bar
- [ackee-lighthouse](https://github.com/electerious/ackee-lighthouse) - Send Lighthouse reports to Ackee
- [ackee-report](https://github.com/BetaHuhn/ackee-report) - CLI tool to generate performance reports
- [gatsby-plugin-ackee-tracker](https://github.com/Burnsy/gatsby-plugin-ackee-tracker) - Gatsby plugin for Ackee
- [Soapberry](https://wordpress.org/plugins/soapberry/) - WordPress plugin for Ackee
- [Ackee-PHP](https://github.com/BrookeDot/ackee-php) - A PHP Class for Ackee
- [use-ackee](https://github.com/electerious/use-ackee) - Use Ackee in React
- [nuxt-ackee](https://github.com/bdrtsky/nuxt-ackee) - Nuxt.js module for Ackee
- [ngx-ackee-wrapper](https://github.com/oakify/ngx-ackee-wrapper) - Angular wrapper for Ackee
- [django-ackee-middleware](https://github.com/suda/django-ackee-middleware) - Django middleware for Ackee
- [gridsome-plugin-ackee](https://github.com/DenzoNL/gridsome-plugin-ackee) - Gridsome plugin for Ackee
- [vuepress-plugin-ackee](https://github.com/spekulatius/vuepress-plugin-ackee) - VuePress plugin for Ackee
- [svelte-ackee](https://github.com/gaia-green-tech/svelte-ackee) - Svelte module for Ackee
- [ackee_dart](https://github.com/marchellodev/ackee_dart) - Ackee plugin for Dart/Flutter ([pub.dev](https://pub.dev/packages/ackee_dart))
- [ackee-tracker-consent](https://www.npmjs.com/package/ackee-tracker-consent) - A consent banner to activate detailed tracking on Ackee

### Links

- [Follow Ackee on Twitter](https://twitter.com/getackee)
- [Vote for Ackee on ProductHunt](https://www.producthunt.com/posts/ackee)

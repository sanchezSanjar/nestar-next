module.exports = {
	i18n: {
		defaultLocale: 'en',
		locales: ['en', 'kr', 'ru', 'uz'],
		localeDetection: false,
	},
	trailingSlash: true,
	// in development re-read public/locales on every request, so edited translations show without a restart
	reloadOnPrerender: process.env.NODE_ENV === 'development',
};

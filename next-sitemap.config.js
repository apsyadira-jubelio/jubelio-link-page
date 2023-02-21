/**
 * @type {import('next-sitemap').IConfig}
 * @see https://github.com/iamvishnusankar/next-sitemap#readme
 */
module.exports = {
	// !STARTERCONF Change the siteUrl
	/** Without additional '/' on the end, e.g. https://apsyadira.com */
	siteUrl: 'https://jube.co',
	generateRobotsTxt: true,
	robotsTxtOptions: {
		policies: [{ userAgent: '*', allow: '/' }],
	},
};

/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://boykissersite.zyrofoxx.com', // ✅ your production URL
    generateRobotsTxt: true, // ✅ also generate robots.txt
    sitemapSize: 7000, // optional: split if > 7000 URLs
    changefreq: 'daily',
    priority: 0.7,
    trailingSlash: false,
  };
  
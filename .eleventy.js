const dirs = ['./src/css', './src/img', './src/**/*js'];
// const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');

module.exports = function (eleventyConfig) {
	for (let dir of dirs) {
		eleventyConfig.addPassthroughCopy(dir);
		eleventyConfig.addWatchTarget(dir);
	}
	// eleventyConfig.addPlugin(syntaxHighlight);
	eleventyConfig.addPassthroughCopy('./robots.txt');

    eleventyConfig.setServerOptions({
		// Use a local key/certificate to opt-in to local HTTP/2 with https
		https: {
			key: "/Users/loaf/localhost-key.pem",
			cert: "/Users/loaf/localhost.pem",
		},
	});

	return {
		dir: {
			input: "src",
			output: "dist",
		},
		pathPrefix: "/vjsa-webapps/"
	};
};

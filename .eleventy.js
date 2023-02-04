const dirs = ['./src/css', './src/img', './src/js'];
// const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');

module.exports = function (eleventyConfig) {
	for (let dir of dirs) {
		eleventyConfig.addPassthroughCopy(dir);
		eleventyConfig.addWatchTarget(dir);
	}
	// eleventyConfig.addPlugin(syntaxHighlight);
	eleventyConfig.addPassthroughCopy('./robots.txt');

	return {
		dir: {
			input: "src",
			output: "dist",
		}, 
		pathPrefix: "/vjsa-webapps/"
	};
};

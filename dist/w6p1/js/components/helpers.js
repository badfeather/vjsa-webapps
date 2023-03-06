function serialize (data) {
	let obj = {};
	for (let [key, value] of data) {
		if (obj[key] !== undefined) {
			if (!Array.isArray(obj[key])) {
				obj[key] = [obj[key]];
			}
			obj[key].push(value);
		} else {
			obj[key] = value;
		}
	}
	return obj;
}

function getCleanURL(url) {
	url = url ? url : window.location.href;
	return url.substring(0, url.indexOf('?') - 1);
}

function getNewURLPath(newPath, url) {
	if (!newPath) return;
	url = url ? url : window.location.href;
	let arr = url.split('/');
	let oldPath = arr[arr.length-2];
	return url.replace(oldPath, newPath);
}

/**
 * Create a PHP-style query string from an object
 * @param  {Object} data   The data to serialize into a string
 * @param  {String} prefix The prefix to use before the string
 * @return {String}        The serialized query string
 */
function buildQuery (data, prefix) {

	// Determine the data type
	var type = Object.prototype.toString.call(data).slice(8, -1).toLowerCase();

	// Loop through the object and create the query string
	return Object.keys(data).map(function (key, index)  {

		// Cache the value of the item
		var value = data[key];

		// Add the correct string if the object item is an array or object
		if (type === 'array') {
			key = prefix + '[' + index + ']';
		} else if (type === 'object') {
			key = prefix ? prefix + '[' + key + ']' : key;
		}

		// If the value is an array or object, recursively repeat the process
		if (typeof value === 'object') {
			return buildQuery(value, key);
		}

		// Join into a query string
		return key + '=' + encodeURIComponent(value);

	}).join('&');

}

export { serialize, getCleanURL, getNewURLPath, buildQuery };

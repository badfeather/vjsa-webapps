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

function getNewURLPath(newPath) {
	if (!newPath) return;
	let url = window.location.href;
	let arr = url.split('/');
	let oldPath = arr[arr.length-2];
	return url.replace(oldPath, newPath);
}

export { serialize, getNewURLPath };

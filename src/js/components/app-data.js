/**
 * Save photos to session storage
 * @param  {Array} photos The photo data
 */
function setAppData (key, value, type) {
	type = ['session', 'local'].includes(type) ? type : 'session';
	if (type === 'session') {
		sessionStorage.setItem(key, JSON.stringify(value));
		return;
	}
	localStorage.setItem(key, JSON.stringify(value));
}


/**
 * Get saved photo data from session storage
 * @return {Array} The photo data
 */
function getAppData (key, type) {
	type = ['session', 'local'].includes(type) ? type : 'session';
	return type === 'session' ? JSON.parse(sessionStorage.getItem(key)) : JSON.parse(localStorage.getItem(key));
}


async function fetchAppData (endpoint, key, type) {
	type = ['session', 'local'].includes(type) ? type : 'session';
	if (!endpoint) return;

	// Check for saved data
	let data = getAppData(key, type);
	if (data) return data;

	try {
		let response = await fetch(endpoint);
		if (!response.ok) throw response;
		data = await response.json();
		setAppData(key, data, type);
		return data;

	} catch (error) {
		console.warn(error);
		return [];
	}
}

export {setAppData, getAppData, fetchAppData};

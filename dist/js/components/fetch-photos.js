/**
 * Save photos to session storage
 * @param  {Array} photos The photo data
 */
function savePhotos (photos) {
	sessionStorage.setItem('photos', JSON.stringify(photos));
}


/**
 * Get saved photo data from session storage
 * @return {Array} The photo data
 */
function getSavedPhotos () {
	return JSON.parse(sessionStorage.getItem('photos'));
}


async function fetchPhotos (endpoint) {
	if (!endpoint) return;

	// Check for saved data
	let saved = getSavedPhotos();
	if (saved) {
		return saved;
	}
	
	try {
		let response = await fetch(endpoint);
		if (!response.ok) throw response;
		let photos = await response.json();
		savePhotos(photos);
		return photos;

	} catch (error) {
		console.warn(error);
		return [];
	}
}

export default fetchPhotos;
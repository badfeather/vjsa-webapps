import {photosDBURL} from './endpoints.js';

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

function getPhotoByID (id, photos) {
	if (!photos.length) return false;
	return photos.find(function(item) {
		return item.id === id;
	});
}

async function fetchPhotos (endpoint = photosDBURL) {
	if (!endpoint) return;

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

export {fetchPhotos, getPhotoByID};

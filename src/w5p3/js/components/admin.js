import {dashboardURL} from './endpoints.js';
// import {savePhotos} from './photos.js';

async function fetchAuthPhotos (endpoint = dashboardURL) {
	if (!endpoint) return;

	try {
		let response = await fetch(endpoint);
		if (!response.ok) throw response;
		let photos = await response.json();
		// savePhotos(photos);
		return photos;

	} catch (error) {
		console.warn(error);
		return false;
	}
}

export {fetchAuthPhotos}

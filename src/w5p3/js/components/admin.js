import {dashboardURL} from './endpoints.js';
// import {savePhotos} from './photos.js';
import {getToken} from './token.js';

async function fetchAuthPhotos (endpoint = dashboardURL) {
	if (!endpoint) return;
	let token = getToken();

	try {
		let response = await fetch(`${endpoint}?token=${token}`);
		if (!response.ok) throw response;
		let photos = await response.json();
		// savePhotos(photos);
		return photos;

	} catch (error) {
		console.warn(error);
		return [];
	}
}

export {fetchAuthPhotos}
